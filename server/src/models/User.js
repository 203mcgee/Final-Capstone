import mongoose from "mongoose";
import bcrypt from 'bcrypt';



// info from this video: https://www.youtube.com/watch?v=yOAiw3gD9O8

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: [true, 'Email is required'],
        unique: true
    },
    passwordHash:{
       type:String,
        required: [true, 'Password hash is required'] 
    },
    roles:{
        type:[String],
        enum: ["users","admin"],
        default:["users"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tokenVersion:{
        type: Number,
        default: 0
    }
    
    

},
{timestamps:true}
);

//Middleware

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.passwordHash;
    delete ret.tokenVersion;
    return ret;
  }
});

export default mongoose.model('User', userSchema);