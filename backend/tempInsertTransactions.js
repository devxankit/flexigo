import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Rider from './modules/rider/riderModel.js';
import SubscriptionPlan from './modules/admin/subscriptionPlanModel.js';
import Transaction from './modules/rider/transactionModel.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const ridersToUpdate = [
      { phone: '8805041137', amount: 2800 }, // Assuming 2800 is the weekly plan, adjust if needed
      { phone: '9922371344', amount: 2800 }
    ];
    
    for (const info of ridersToUpdate) {
      const rider = await Rider.findOne({ phone: info.phone }).populate('subscriptionPlan');
      
      if (rider) {
        console.log(`Processing Rider: ${rider.name || rider.phone}`);
        
        const planName = rider.subscriptionPlan ? rider.subscriptionPlan.name : 'Weekly Rent';
        const planId = rider.subscriptionPlan ? rider.subscriptionPlan._id : null;
        const amount = rider.subscriptionPlan ? rider.subscriptionPlan.price : info.amount;

        // Check if transaction already exists to avoid duplicates
        const existingTxn = await Transaction.findOne({
          riderId: rider._id,
          method: 'razorpay',
          status: 'success',
          amount: amount
        });

        if (!existingTxn) {
          await Transaction.create({
            riderId: rider._id,
            amount: amount,
            type: 'debit',
            status: 'success',
            description: `Plan Upgrade: ${planName} (Manual DB Recovery)`,
            method: 'razorpay',
            planId: planId
          });
          console.log(`✅ Transaction added for ${rider.phone}`);
        } else {
          console.log(`⚠️ Transaction already exists for ${rider.phone}`);
        }
      } else {
        console.log(`❌ Rider not found: ${info.phone}`);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
};

run();
