// This is for the 
import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track user IDs
});

export default mongoose.model('Skill', skillSchema);