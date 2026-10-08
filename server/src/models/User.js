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


