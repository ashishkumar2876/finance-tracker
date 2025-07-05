// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI;

// if (!uri) throw new Error('Missing MONGODB_URI in .env.local');

// let client;
// let clientPromise;

// if (process.env.NODE_ENV === 'development') {
//   // In dev, use a global variable so it doesn't create multiple connections
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   // In production, just connect
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// export default clientPromise;



import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise; 