import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);
export default Counter;

export async function nextSkillId() {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'skill' },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  return `SKL-${String(counter.seq).padStart(4, '0')}`;
}