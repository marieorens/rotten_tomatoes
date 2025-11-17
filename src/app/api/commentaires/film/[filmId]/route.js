// app/api/commentaires/film/[filmId]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/db';
import Commentaire from '../../../models/Commentaire';

// GET - Récupérer les commentaires d'un film
export async function GET(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const { filmId } = resolvedParams;

    const commentaires = await Commentaire.find({
      filmId: filmId,
      actif: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      commentaires,
    });
  } catch (error) {
    console.error('Erreur GET /api/commentaires/film/[filmId]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
