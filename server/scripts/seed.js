import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Skill from '../src/models/Skill.js';
import User from '../src/models/User.js';
import Counter from '../src/models/Counter.js';

async function seed() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 2. Production Safety Guard
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
     throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
   }

    // 3. Clear existing database collections
    console.log('🧹 Clearing existing Skills and Users...');
    await Skill.deleteMany({});
    await User.deleteMany({});

    // Drop legacy database indexes to prevent stale constraints
    try {
      await User.collection.dropIndexes();
      console.log('✨ Dropped legacy user indexes');
    } catch (err) {
      // Ignore error if collection/indexes don't exist yet
    }

    // 4. Hash passwords for seed users (cost factor 12)
    const adminPasswordHash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'AdminPassword123!',
      12
    );
    const userPasswordHash = await bcrypt.hash('UserPassword123!', 12); // UserPassword123! is regular password

    // 5. Create users array (1 Admin + 3 Regular Users)
    const usersToCreate = [
      {
        email: (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase(),
        passwordHash: adminPasswordHash,
        role: 'admin',
        isActive: true,
        tokenVersion: 0
      },
      {
        email: 'user1@example.com',
        passwordHash: userPasswordHash,
        role: 'user',
        isActive: true,
        tokenVersion: 0
      },
      {
        email: 'user2@example.com',
        passwordHash: userPasswordHash,
        role: 'user',
        isActive: true,
        tokenVersion: 0
      },
      {
        email: 'user3@example.com',
        passwordHash: userPasswordHash,
        role: 'user',
        isActive: true,
        tokenVersion: 0
      }
    ];

    const createdUsers = await User.insertMany(usersToCreate);
    console.log(`👤 Created ${createdUsers.length} Users (1 Admin, 3 Regular Users)`);

    // Extract created user documents for skills endorsements
    const [, user1, user2, user3] = createdUsers;

    // 6. Seed Skills referencing created user ObjectIds
    const skillsToCreate = [
      {
        _id: 'SKL-0001',
        name: 'C++',
        category: 'tools',
        level: 'advanced',
        yearsExperience: 4,
        endorsements: 1,
        endorsedBy: [user1._id]
      },
      {
        _id: 'SKL-0002',
        name: 'C',
        category: 'tools',
        level: 'advanced',
        yearsExperience: 2,
        endorsements: 1,
        endorsedBy: [user1._id]
      },
      {
        _id: 'SKL-0003',
        name: 'Javascript',
        category: 'tools',
        level: 'intermediate',
        yearsExperience: 2,
        endorsements: 2,
        endorsedBy: [user2._id, user3._id]
      },
      {
        _id: 'SKL-0004',
        name: 'HTML',
        category: 'frontend',
        level: 'beginner',
        yearsExperience: 0.5,
        endorsements: 1,
        endorsedBy: [user3._id]
      },
      {
        _id: 'SKL-0005',
        name: 'CSS',
        category: 'frontend',
        level: 'beginner',
        yearsExperience: 0.5,
        endorsements: 1,
        endorsedBy: [user3._id]
      },
      {
        _id: 'SKL-0006',
        name: 'React.js',
        category: 'frontend',
        level: 'beginner',
        yearsExperience: 0.5,
        endorsements: 1,
        endorsedBy: [user3._id]
      },
      {
        _id: 'SKL-0007',
        name: 'Node.js',
        category: 'backend',
        level: 'intermediate',
        yearsExperience: 0.75,
        endorsements: 2,
        endorsedBy: [user2._id, user3._id]
      },
      {
        _id: 'SKL-0008',
        name: 'MySQL',
        category: 'database',
        level: 'intermediate',
        yearsExperience: 0.75,
        endorsements: 1,
        endorsedBy: [user2._id]
      }
    ];

    const createdSkills = await Skill.insertMany(skillsToCreate);
    await Counter.deleteMany({});
    await Counter.create({ _id: 'skill', seq: skillsToCreate.length });
    console.log(`🛠️ Added ${createdSkills.length} Skills`);

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

seed();