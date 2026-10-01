import mongoose from 'mongoose';


const skillSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            trim: true
        },
        name: {
            type: String,
            required: [true, 'This skill needs to have a name'],
            unique: true,
            trim: true
        },
        category: {
            type: String,
            enum: ["frontend", "backend", "database","tools","design level"],
            trim:true,

        },
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            trim:true

        },
        yearsExperience: {
            type: Number,
            minimum: 0,
        },
        endorsements: {
            type: Number,
            minimum: 0,
            default: 0
        },
        endorsedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]

    }
);

// skillSchema.set('toJSON', {
//   virtuals: true, // adds a string "id" field
//   versionKey: false, // hides "__v"
//   transform: (doc, ret) => {
//     delete ret._id;
//     return ret;
//   },
// });

skillSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.endorsedBy; // Capstone spec: endorsedBy is never sent to the client
    return ret;
  }
});``

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

