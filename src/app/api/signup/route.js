import { connectDB } from '../config/db.js';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { setCookie } from '../utils/setCookies.js';

export async function POST(request) {
  await connectDB();

  const body = await request.json();
  const { username, email, password } = body;

  try {
    if (!email || !password || !username) {
      throw new Error('All fields are required.');
    }
    const userEmailExists = await User.findOne({ email });

    if (userEmailExists) {
      return Response.json({ message: 'User already exists.' }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });

    await setCookie(user._id);

    return Response.json(
      {
        message: 'utilisateur créé avec succès.',
        user: { ...user.toObject(), password: undefined },
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 });
  }
}
