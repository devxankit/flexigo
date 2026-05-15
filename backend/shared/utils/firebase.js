import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

const serviceAccountPath = join(process.cwd(), 'config', 'flexigo-74574-firebase-adminsdk-fbsvc-7ea86115da.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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
