import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const serviceAccountName = 'firebase-key.json';
const serviceAccountPath = existsSync(join(process.cwd(), 'config', serviceAccountName))
  ? join(process.cwd(), 'config', serviceAccountName)
  : join(process.cwd(), 'backend', 'config', serviceAccountName);

if (existsSync(serviceAccountPath)) {
  console.log('🚀 Initializing Firebase with:', serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath)
  });
  console.log('✅ Firebase Initialized Successfully');
} else {
  console.log('❌ CRITICAL: Firebase Service Account file NOT FOUND at:', serviceAccountPath);
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
