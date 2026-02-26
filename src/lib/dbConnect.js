// ./src/lib/dbConnect.js
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

if (!uri) throw new Error("Please add your MONGODB_URI to .env.local");

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Development: hot reload safe
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  // Production: new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Connect to a collection in MongoDB
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Collection>} MongoDB Collection instance
 */
export async function connect(collectionName) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection(collectionName);
}