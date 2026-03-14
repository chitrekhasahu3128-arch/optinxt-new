const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    let connected = false;

    // 1. Try to use real Mongo if URI provided
    if (mongoURI) {
      try {
        console.log('Attempting to connect to primary MongoDB URI...');
        await mongoose.connect(mongoURI, {
          serverSelectionTimeoutMS: 2000 // fail fast
        });
        console.log('MongoDB Connected to provided URI.');
        connected = true;
      } catch (err) {
        console.warn('Failed to connect to primary MongoDB URI:', err.message);
      }
    }

    // 2. If not connected, spin up in-memory instance
    if (!connected) {
      console.log('Spinning up a zero-config in-memory MongoDB for local dev...');
      try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log(`In-Memory MongoDB Connected at ${uri}`);
        process.env.CURRENT_DB_URI = uri;
      } catch (memErr) {
        console.error('Failed to start In-Memory MongoDB:', memErr.message);
        throw memErr;
      }
    }

    // 3. Auto-seed if DB is empty
    try {
      console.log('Checking if database needs seeding...');
      // We need to import the model AFTER connection is established
      const Employee = require('../models/Employee');
      const count = await Employee.countDocuments();
      console.log(`Current employee count: ${count}`);
      
      if (count === 0) {
        console.log('Database is empty. Attempting auto-seed...');
        const seedDatabase = require('../seed');
        if (typeof seedDatabase === 'function') {
          await seedDatabase();
          console.log('Auto-seed complete.');
        } else {
          console.warn('seed.js does not export a function.');
        }
      } else {
        console.log(`Database already contains ${count} employees. Skipping auto-seed.`);
      }
    } catch (seederErr) {
      console.warn('Auto-seed check failed or skipped:', seederErr.message);
    }

  } catch (err) {
    console.error('Database Initialization failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
