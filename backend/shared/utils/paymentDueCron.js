import cron from 'node-cron';
import Rider from '../../modules/rider/riderModel.js';
import SubscriptionPlan from '../../modules/admin/subscriptionPlanModel.js';
import Admin from '../../modules/admin/adminModel.js';
import { sendPushNotification } from './firebase.js';
import { sendSMS } from './smsService.js';

// Run every day at 9:00 AM — check for expired weekly plans
export const startPaymentDueCron = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ [CRON] Running weekly payment due check...');

    try {
      const now = new Date();
      
      // Calculate exactly the previous day (which means 7 days are fully complete)
      // Example: Paid 25 May -> 7 days complete on 1 June -> Today is 2 June (Next day / 8th day)
      const targetDateStart = new Date(now);
      targetDateStart.setDate(targetDateStart.getDate() - 1);
      targetDateStart.setHours(0, 0, 0, 0);
      
      const targetDateEnd = new Date(now);
      targetDateEnd.setHours(0, 0, 0, 0);

      // Find riders whose subscription ended strictly between yesterday 00:00 and today 00:00
      // This ensures the reminder ONLY goes once, exactly on the next day after completion.
      const expiredRiders = await Rider.find({
        subscriptionEnd: { $gte: targetDateStart, $lt: targetDateEnd },
        subscriptionPlan: { $ne: null },
        status: { $in: ['active', 'approved'] }
      }).populate('subscriptionPlan');

      const weeklyExpiredRiders = expiredRiders.filter(rider => {
        return rider.subscriptionPlan && rider.subscriptionPlan.type === 'Weekly';
      });

      if (weeklyExpiredRiders.length === 0) {
        console.log('✅ [CRON] No weekly payment dues found.');
        return;
      }

      console.log(`⚠️ [CRON] Found ${weeklyExpiredRiders.length} riders with weekly payment due.`);

      // Notify each rider
      for (const rider of weeklyExpiredRiders) {
        const planName = rider.subscriptionPlan.name || 'Weekly Plan';
        const amount = rider.subscriptionPlan.price || 0;
        const dueMessage = `Payment Due: Your ${planName} (₹${amount}) has expired. Please renew to continue using your vehicle.`;

        // Push notification to rider
        const riderToken = rider.fcmToken || rider.fcmTokenMobile;
        if (riderToken) {
          try {
            await sendPushNotification(
              riderToken,
              '⚠️ Payment Due',
              `Your ${planName} (₹${amount}) has expired. Please renew now.`,
              { type: 'payment_due', amount: amount.toString(), planName }
            );
            console.log(`📱 [CRON] Notification sent to rider: ${rider.name || rider.phone}`);
          } catch (e) {
            console.error(`❌ [CRON] Failed to notify rider ${rider.phone}:`, e.message);
          }
        }

        // SMS to rider
        try {
          await sendSMS(rider.phone, dueMessage);
        } catch (e) {
          console.error(`❌ [CRON] SMS failed for ${rider.phone}:`, e.message);
        }
      }

      // Notify all SuperAdmins
      const admins = await Admin.find({ role: 'SuperAdmin' });
      const riderNames = weeklyExpiredRiders.map(r => r.name || r.phone).join(', ');
      const totalDue = weeklyExpiredRiders.reduce((sum, r) => sum + (r.subscriptionPlan?.price || 0), 0);

      for (const admin of admins) {
        if (admin.fcmToken) {
          try {
            await sendPushNotification(
              admin.fcmToken,
              `⚠️ ${weeklyExpiredRiders.length} Weekly Payment(s) Due`,
              `Total ₹${totalDue} pending from: ${riderNames.substring(0, 100)}`,
              { type: 'payment_due_admin', count: weeklyExpiredRiders.length.toString(), totalDue: totalDue.toString() }
            );
          } catch (e) {
            console.error('❌ [CRON] Admin notification failed:', e.message);
          }
        }
      }

      console.log(`✅ [CRON] Payment due notifications sent to ${weeklyExpiredRiders.length} riders + admins.`);
    } catch (error) {
      console.error('❌ [CRON] Payment due check failed:', error.message);
    }
  });

  console.log('✅ [CRON] Weekly payment due checker scheduled (daily at 9:00 AM)');
};
