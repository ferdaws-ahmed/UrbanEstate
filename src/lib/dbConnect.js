import { MongoClient, ServerApiVersion } from "mongodb";
const uri = process.env.MONGODB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const connect = (collection) => {
  const database = process.env.DB_NAME;
  return client.db(database).collection(collection);
};
