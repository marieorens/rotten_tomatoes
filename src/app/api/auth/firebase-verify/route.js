import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert } from 'firebase-admin/app';
import { serviceAccount } from '@/config/firebaseServiceAccount';

try {
  initializeApp({ credential: cert(serviceAccount) });
} catch (e) {}

export async function POST(req) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: 'token manquant' }, { status: 401 });
  try {
    const decoded = await getAuth().verifyIdToken(token);
    return NextResponse.json({ user: decoded });
  } catch (err) {
    return NextResponse.json({ error: 'oken invalide' }, { status: 401 });
  }
}
