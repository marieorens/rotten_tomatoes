import { NextResponse } from 'next/server';
import dbConnect from '../../models/dbConnect';
import User from '../../models/user.model';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const { email } = await req.json();
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé.' }, { status: 404 });
  }

  const resetToken = Math.random().toString(36).slice(2) + Date.now();
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 24 * 3600 * 1000; // 24h
  await user.save();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${encodeURIComponent(resetToken)}`;
  await transporter.sendMail({
    from: 'noreply@example.com',
    to: email,
    subject: 'Réinitialisation du mot de passe',
    html: `<p>Pour réinitialiser votre mot de passe, cliquez ici : <a href="${resetUrl}">${resetUrl}</a></p>`
  });

  return NextResponse.json({ message: 'Email envoyé.' });
}
