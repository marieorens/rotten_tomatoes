import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { setCookie } from '../utils/setCookies.js';
import { connectDB } from '../config/db.js';

export async function POST(request) {
  await connectDB();
  const body = await request.json();

  const { email, password } = body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: 'Identifiants invalides.' }, { status: 400 });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json({ message: 'Identifiants invalides.' }, { status: 400 });
    }

    await setCookie(user._id);

    return Response.json(
      {
        message: 'Connexion réussie.',
        user: { ...user.toObject(), password: undefined },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log('Erreur de connexion', error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
