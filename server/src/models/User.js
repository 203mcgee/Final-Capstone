import mongoose from "mongoose";
import bcrypt from "bcrypt";



// info from this video: https://www.youtube.com/watch?v=yOAiw3gD9O8

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
       type:String,
        required: true 
    },
    roles:{
        type:[String],
        default:["users"]
    }

});

//Middleware

userSchema.pre("save", async function(next){
    try{
        if(!this.isModified("password")){
            return next();
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(this.password,salt);
    }
});