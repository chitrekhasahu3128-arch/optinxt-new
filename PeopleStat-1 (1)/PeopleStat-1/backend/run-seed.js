const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const seedDatabase = require('./seed');

const run = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');
    await seedDatabase();
    console.log('Seeding finished');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
