const admin = require("firebase-admin");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

// SORASORI DATA BOSHIYE DIN (For one-time use)
const FIREBASE_CONFIG = {
    projectId: "urbanestate-be0fe",
    clientEmail: "firebase-adminsdk-fbsvc@urbanestate-be0fe.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDeYOGrFt0VkL7a\nWE+O7KQmZVfJV9h2NXqdS46Qx6++6AnLE0VBJiodVVfrFciHdG/PX0iUXsCZVVRe\nB0pRLAHM5nYifD9396JErdnHTc0O06gQjaX2cH9HDfbz5Jc/TprSXBTuQ2l5di07\nDd/jXazEiZyBTGhnlKlUCY0dAZou2p+KhUWAFPVJv1PBv9FjAInP9salKBuiQCXN\no56VLckYBpcyRq0Y3TxzKgm7UJyF1m8GFRb2YX1ACxFtfYEDMZICpetzN0DEdMud\nWHAJs2F5LTjfLr6obJNpWX0VFiXw54QNUFffHalrWG8hC625VusW8ghJwZWOsp+M\nyuXisq0fAgMBAAECggEAUXFl9MUA318NpuXk7VFZpP5EsmbLzi8z4tvDMN8RTHeq\n7ob2PDAACJIzCtQFhyZrtKUO7dft7bpEldNRsnzNg/97kJG0pPk6orCRK98glKeL\ny9Q0zhbRZnKE2ToE8piVNymmOMTTojpXwmMIdjrehXRoryoOqrDVewOsfM0TbMjS\nCWOTdIbJQbN8sI6wJ3wlO+BWO8C0C1XEEkSxD5GYEbhW2kbP3wbZ/VlG75rb58UE\nt08qNICXibe3PW46ZQg18kEQHspsayoAmlzIHag+ORfn74jWyrGpx9o1iUpn6uMd\nSikymHFItDDi8QkNBMoH6uZ63zmPCuCpfC60FuwjYQKBgQDz/8Np/Q0zxwiLkr+m\nigq+Yntpu4+3XClB7RIs6kHnAg6GBuq3e4lHYtfC3BMVorrA4Hr3yb7CoMAOl7AB\nKiISpCeFVpopjTcjjRumVgmSpKmeqUNQZ8a3P7pFLs4kKm13Wq/dhRMmQchgZl1I\ndgJtHJNv0dIg7uM/MJ2TGcfPpwKBgQDpUOONZQOkJzcLYKVUfB87844npYmh5nZK\ni66GrSzywMmqMgSrTBF/pxnEOmnhY+Xw3lWnFMzAcUR5MRYMxaRyArbx4K//tnql\nWbW7k10O6s3eLc4uf1uZjJ8upaA+ITtE2aMX+XP8E0EY7THGqiMPMXxrZefWXFzi\n1hBEU3alyQKBgGZlTC27i4HSIgzozdLnFXEmRSJvGvXZEFthUQJWYMfAPjYSywer\ KUYy/dcBomSvAO6WhiRcnthwu4ikMbGba+ckyo0TdejAIYai3hqk+ql2vtQdtmkU\n0/jtHo+P/+R/habUAP/Wq92fN6b07mrNU2FU367KgANgHS/UiBxGcmr7AoGBAN+m\ngFp7qD/kr2kinZkc2jv3vh7XGdWuO1o+B3Bl9J5Gm4mgJMWnR2bcYWCutewufK6m\nEej1kUgvy3l4yjA4DOiVHZVC0rMG0w5JrmE+Y4f3IJyHwArmXoIUQErQzYiBBnV7\nQlGq97l9I3unc32CfdUElMXGi7P6Gbf/htxYPXWxAoGAaJOniURB68LthBM+KU3x\nlcS0ST6nNjyF3na2YC0GRu7rlL9P8vGITiNgmKNswU5H8eMiTj999+ZTkt+i4IZm\nVeHfv+0SC5rhpZvM/0D78PobXfCznJ1gCAsNRN2JThpvcYTLGSC+hnjrIqsel8EA\n0kajoy9lOw0Ybb2rtqftJ5Y=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n')
};

const MONGODB_URI = "mongodb+srv://UrbanEstate_DB:cJbkTBWBKv37jozu@cluster0.wtnhlvb.mongodb.net/UrbanEstateDB?retryWrites=true&w=majority";

async function runDirectSeed() {
    const adminApp = admin.initializeApp({
        credential: admin.credential.cert(FIREBASE_CONFIG)
    });

    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db("UrbanEstateDB");
        const usersCollection = db.collection("users");

        const users = [
            { email: "user@demo.com", name: "Demo User", role: "user" },
            { email: "seller@demo.com", name: "Demo Seller", role: "seller" },
            { email: "admin@demo.com", name: "Demo Admin", role: "admin" }
        ];

        for (const u of users) {
            console.log(`Processing ${u.email}...`);
            let fbUser;
            try {
                fbUser = await admin.auth().createUser({ email: u.email, password: "123456" });
            } catch (e) {
                fbUser = await admin.auth().getUserByEmail(u.email);
            }

            const hash = await bcrypt.hash("123456", 10);
            await usersCollection.updateOne(
                { email: u.email },
                { $set: { ...u, uid: fbUser.uid, password: hash, isDemo: true, createdAt: new Date() } },
                { upsert: true }
            );
            console.log(`✅ ${u.email} synced.`);
        }
        console.log("✨ All Done!");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
        process.exit();
    }
}

runDirectSeed();