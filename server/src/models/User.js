import mongoose from "mongoose";
import bcrypt from 'bcrypt';



// info from this video: https://www.youtube.com/watch?v=yOAiw3gD9O8

const userSchema = new mongoose.Schema({
    email: { type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      lowercase: true, 
      trim: true },
    passwordHash: {
        type: String,
        required: [true, 'Password hash is required']
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tokenVersion: {
        type: Number,
        default: 0
    }



},
    { timestamps: true }
);
// // Virtual field for plain-text password
// userSchema
//   .virtual('password')
//   .set(function (value) {
//     this._plainPassword = value;
//   })
//   .get(function () {
//     return this._plainPassword;
//   });

// userSchema.pre('save', async function () {
//     // Only hash password if modified
//     if (!this.isModified('passwordHash')) return;

//     const salt = await bcrypt.genSalt(10);
//     this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
// });

// Compare password method for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// toJSON cleanup: hide sensitive fields from API responses
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.passwordHash;
    delete ret.tokenVersion;
    delete ret._plainPassword;
    return ret;
  },
});

export default mongoose.model('User', userSchema);


// userSchema.pre('save', async function (next) {
//     // Only hash the password if it has been modified (or is new)
//     if (!this.isModified('passwordHash')) return next();

//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// userSchema.methods.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.passwordHash);
// };

// //Middleware

// userSchema.set('toJSON', {
//     virtuals: true,
//     versionKey: false,
//     transform: (doc, ret) => {
//         ret.id = ret._id;
//         delete ret._id;
//         delete ret.passwordHash;
//         delete ret.tokenVersion;
//         return ret;
//     }
// });

// export default mongoose.model('User', userSchema);