import { cookies } from 'next/headers';
import { connectDB } from '../config/db.js';

export async function POST(request) {
  await connectDB();
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    return Response.json({ message: 'déconexion réussie.' }, { status: 200 });
  } catch (error) {
    console.log('Erreur de déconnexion', error);
    return Response.json({ message: 'Erreur de déconnexion' }, { status: 400 });
  }
}
