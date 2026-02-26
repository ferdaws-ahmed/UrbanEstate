import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  // শুধুমাত্র তখনই ইনিশিয়ালাইজ হবে যখন সব ডাটা উপস্থিত থাকবে
  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    // বিল্ডের সময় ডাটা না পেলে ক্র্যাশ করার বদলে ওয়ার্নিং দেখাবে
    console.warn("Firebase Admin setup skipped: Missing environment variables during build.");
  }
}

// admin.apps.length চেক করে auth এক্সপোর্ট করা নিরাপদ
const adminAuth = admin.apps.length ? admin.auth() : null;

export { adminAuth };