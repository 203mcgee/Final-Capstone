// import 'dotenv/config';
// import mongoose from 'mongoose';
// import Skill from './models/Skill.js';

// // This is too help define user id
// const user1 = new mongoose.Types.ObjectId();
// const user2 = new mongoose.Types.ObjectId();
// const user3 = new mongoose.Types.ObjectId();

// const skills = [
//     { _id:"SKL-0001",name:"C++",category:"tools",level:"advanced",yearsExperience:4 ,endorsements:1 ,endorsedBy:[user1] },
//     { _id:"SKL-0002",name:"C",category:"tools",level:"advanced",yearsExperience:2 ,endorsements:1 ,endorsedBy: [user1]},
//     { _id:"SKL-0003",name:"Javascript",category:"tools",level:"intermediate",yearsExperience:2 ,endorsements:2 ,endorsedBy: [user2,user3]},
//     { _id:"SKL-0004",name:"HTML",category:"frontend",level:"beginner",yearsExperience:.5 ,endorsements:1 ,endorsedBy:[user3] },
//     { _id:"SKL-0005",name:"CSS",category:"frontend",level:"beginner",yearsExperience:.5 ,endorsements:1 ,endorsedBy:[user3] },
//     { _id:"SKL-0006",name:"React.js",category:"frontend",level:"beginner",yearsExperience:.5 ,endorsements:1 ,endorsedBy:[user3] },
//     { _id:"SKL-0007",name:"Node.js",category:"backend",level:"intermediate",yearsExperience:.75 ,endorsements:2 ,endorsedBy:[user2,user3] },
//     { _id:"SKL-0008",name:"MySQL",category:"database",level:"intermediate",yearsExperience:.75 ,endorsements:1 ,endorsedBy:[user2] }
// ]

// async function seed() {
//    try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected to MongoDB');

//     // Safety net: never wipe a real database by accident.
//     if (process.env.NODE_ENV === 'production') {
//       console.error('Refusing to seed a production database.');
//       process.exit(1);
//     }

//     // https://www.youtube.com/watch?v=5PEhUQuHOh4
//     await mongoosePopulatedDocumentMarker.connect("mongodb://localhost:5000/")

//     await Skill.deleteMany({});
//     console.log('Cleared existing Skills');

//     const created = await Skill.insertMany(skills);
//     console.log(`Added ${created.length} Skills`);
//   } catch (err) {
//     console.error('Seeding failed:', err.message);
//     process.exitCode = 1;
//   } finally {
//     await mongoose.connection.close();
//   }  
// }

// seed();

// // _id
// // String, custom ID like SKL-0001
// // name
// // String, required, unique
// // category
// // String, one of e.g. frontend, backend, database, tools, design
// // level
// // String, one of beginner, intermediate, advanced
// // yearsExperience
// // Number, min 0
// // endorsements
// // Number, min 0, default 0
// // endorsedBy
// // Array of user IDs, never sent to the client


import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Skill from '../src/models/Skill.js';
import User from '../src/models/User.js';

async function seed() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 2. Production Safety Guard
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Refusing to seed a production database.');
      process.exit(1);
    }

    // 3. Clear existing database collections
    // ... inside seed() function ...

    // Clear existing documents
    await Skill.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleared existing Skills and Users');

    // Drop legacy database indexes (removes leftover username_1 unique constraint)
    try {
      await User.collection.dropIndexes();
      console.log('✨ Dropped legacy user indexes');
    } catch (err) {
      // Ignore error if collection/indexes don't exist yet
    }

    // Proceed to insert users...
    // const createdUsers = await User.insertMany(usersToCreate);
    // 4. Hash passwords for seed users (cost 12 per capstone spec)
    const adminPasswordHash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'AdminPass123!',
      12
    );
    const userPasswordHash = await bcrypt.hash('UserPass123!', 12);

    // 5. Seed Users (Admin created ONLY via seed script)
    const usersToCreate = [
      {
        email: (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase(),
        passwordHash: adminPasswordHash,
        role: 'admin',
        isActive: true,
        tokenVersion: 0
      },
      {
        email: 'dev.user1@example.com',
        passwordHash: userPasswordHash,
        role: 'user',
        isActive: true,
        tokenVersion: 0
      },
      {
        email: 'dev.user2@example.com',
        passwordHash: userPasswordHash,
        role: 'user',
        isActive: true,
        tokenVersion: 0
      },
      {
        email: 'dev.user3@example.com',
        passwordHash: userPasswordHash,
        role: 'user',
        isActive: true,
        tokenVersion: 0
      }
    ];

    const createdUsers = await User.insertMany(usersToCreate);
    console.log(`👤 Created ${createdUsers.length} Users (1 Admin, 3 Regular Users)`);

    // Extract real generated ObjectIds for skill endorsements
    const [, user1, user2, user3] = createdUsers;

    // 6. Seed Skills with real user ObjectIds in endorsedBy
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