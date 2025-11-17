import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongo DB connected:');
  } catch (error) {
    console.log('eror connecting to mongodb', error.message);
    process.exit(1);
  }
};
