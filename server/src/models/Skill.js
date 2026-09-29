import mongoose from 'mongoose';


const skillSchmea = new mongoose.Schema(
    {
        id: {
            type: string
        },
        name: {
            type: string,
            required: [true, 'This skill needs to have a name'];
            unique
        },
        category: {
            type:string,

        },
        level: {
            type: string
        },
        yearsExperience: {
            type: Number,
            min: 0
        },
        endorsements: {
            type: Number
        },
        endorsedBy: {
            
        }

    }
);

export default mongoose.model('Skill', skillSchema);

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

