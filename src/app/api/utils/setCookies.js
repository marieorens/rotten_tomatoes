import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const setCookie = async (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET non défini dans le .env');
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
  });

  return token;
};
