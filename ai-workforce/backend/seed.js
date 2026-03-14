import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create demo users
    const demoUsers = [
      {
        email: 'employee@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'employee',
        department: 'Engineering',
        position: 'Senior Developer',
        phone: '555-0101',
      },
      {
        email: 'manager@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'manager',
        department: 'Engineering',
        position: 'Engineering Manager',
        phone: '555-0102',
      },
      {
        email: 'employee2@example.com',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Johnson',
        role: 'employee',
        department: 'Design',
        position: 'UX Designer',
        phone: '555-0103',
      },
      {
        email: 'manager2@example.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Williams',
        role: 'manager',
        department: 'Product',
        position: 'Product Manager',
        phone: '555-0104',
      },
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log(`✅ Seeded ${createdUsers.length} users`);

    // Display created users
    console.log('\n📋 Created Users:');
    createdUsers.forEach((user) => {
      console.log(`- ${user.email} (${user.role}) - ${user.firstName} ${user.lastName}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
