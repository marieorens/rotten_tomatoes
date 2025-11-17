import { NextResponse } from 'next/server';
import dbConnect from '../../models/dbConnect';
import User from '../../models/user.model';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { token, password } = await req.json();
  await dbConnect();
  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) {
    return NextResponse.json({ error: 'Lien invalide ou expiré.' }, { status: 400 });
  }
  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();
  return NextResponse.json({ message: 'Mot de passe réinitialisé.' });
}
