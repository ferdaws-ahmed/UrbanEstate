// Script to fix images in MongoDB
// Run: node fix-images.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'urbandb';

const defaultImages = [
  "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1721933/pexels-photo-1721933.jpeg?auto=compress&cs=tinysrgb&w=600",
];

async function fixImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('properties');
    
    // Get all properties
    const properties = await collection.find({}).toArray();
    console.log(`Found ${properties.length} properties`);
    
    // Update each property with valid images
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      const newImages = [defaultImages[i % defaultImages.length]];
      
      await collection.updateOne(
        { _id: prop._id },
        { $set: { images: newImages } }
      );
      
      console.log(`Updated property ${i + 1}: ${prop.title}`);
    }
    
    console.log('✅ All images fixed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixImages();
