// fixAdmin.js
import 'dotenv/config';
import mongoose from 'mongoose';

async function run() {
  try {
    const uri = process.env.MONGODB_URI;
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);

    const result = await mongoose.connection.db
      .collection('users')
      .updateOne({ email: adminEmail }, { $set: { role: 'admin' } });

    console.log(`✅ Success! Updated admin role count: ${result.modifiedCount}`);
  } catch (err) {
    console.error('❌ Error updating admin:', err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

run();