// app/api/films/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../config/db';
import Film from '../models/Film';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const films = await Film.find({ actif: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Film.countDocuments({ actif: true });

    return NextResponse.json({
      success: true,
      films,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur GET /api/films:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Créer un nouveau film
export async function POST(request) {
  try {
    await connectDB();

    const filmData = await request.json();

    const film = await Film.create({
      titre: filmData.titre,
      description: filmData.description,
      genre: filmData.genre,
      dateSortie: filmData.dateSortie,
      realisateur: filmData.realisateur,
      affiche: filmData.affiche,
      duree: filmData.duree,
      tmdbId: filmData.tmdbId || null,
    });

    return NextResponse.json({
      success: true,
      filmId: film._id.toString(),
      film,
    });
  } catch (error) {
    console.error('Erreur POST /api/films:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
