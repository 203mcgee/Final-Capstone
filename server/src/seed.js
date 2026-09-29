import 'dotenv/config';
import mongoose from 'mongoose';
import Skill from './models/Skill';

const skills = [
    {id:"SK-01",name:"C++",category:"",level:"",yearsExperince: ,endorsements: ,endorsedBy: },
    {id:"SK-02",name:"C",category:"",level:"",yearsExperince: ,endorsements: ,endorsedBy: },
    {id:"SK-03",name:"Javascript",category:"",level:"",yearsExperince: ,endorsements: ,endorsedBy: },
    {id:"SK-04",name:"HTML",category:"",level:"",yearsExperince: ,endorsements: ,endorsedBy: },
    {id:"SK-05",name:"CSS",category:"",level:"",yearsExperince: ,endorsements: ,endorsedBy: },
    {id:"SK-06",name:"React.js",category:"",level:"",yearsExperince: ,endorsements: ,endorsedBy: },
    {id:"SK-07",name:"Node.js",category:"",level:"",yearsExperince: ,endorsements: ,endorsedBy: },
    {id:"SK-08",name:"MySQL",category:"",level:"",yearsExperince: ,endorsements: ,endorsedBy: }
]

async function seed() {
   try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Safety net: never wipe a real database by accident.
    if (process.env.NODE_ENV === 'production') {
      console.error('Refusing to seed a production database.');
      process.exit(1);
    }

    await Recipe.deleteMany({});
    console.log('Cleared existing Skills');

    const created = await Skill.insertMany(skills);
    console.log(`Added ${created.length} Skills`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }  
}

seed();

// _id
// String, custom ID like SKL-0001
// name
// String, required, unique
// category
// String, one of e.g. frontend, backend, database, tools, design
// level
// String, one of beginner, intermediate, advanced
// yearsExperience
// Number, min 0
// endorsements
// Number, min 0, default 0
// endorsedBy
// Array of user IDs, never sent to the client


