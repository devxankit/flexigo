import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const serviceAccountPath = join(process.cwd(), 'config', 'flexigo-74574-firebase-adminsdk-fbsvc-7ea86115da.json');

let serviceAccount = null;

if (existsSync(serviceAccountPath)) {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
}

if (serviceAccount) {
  console.log('🚀 Initializing Firebase with Key ID:', serviceAccount.private_key_id);
  admin.initializeApp({
    credential: admin.credential.cert({
      ...serviceAccount,
      private_key: serviceAccount.private_key
        .replace(/\\n/g, '\n')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n')
    })
  });
  console.log('✅ Firebase Initialized');
} else {
  console.log('❌ Firebase Service Account not found. Push notifications will fail.');
}

// Allowed Platforms Configuration
export const ALLOWED_PLATFORMS = ["web", "app", "android", "ios"];

console.log('✅ Firebase Initialized');
console.log('✅ Platforms Allowed:', ALLOWED_PLATFORMS.join(', '));

export const sendPushNotification = async (token, title, body, data = {}) => {
  if (!token) return;

  const message = {
    notification: {
      title,
      body,
    },
    data,
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message (FCM):', error.message);
    // Do not throw, so the main operation (KYC/Assignment) can complete
    return { success: false, error: error.message };
  }
};

export default admin;
