// app/api/films/statistiques/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../config/db';
import Film from '../../models/Film';

// GET - Obtenir les statistiques des films
export async function GET(request) {
  try {
    await connectDB();

    const films = await Film.find({ actif: true }).lean();

    let totalFilms = films.length;
    let totalNotes = 0;
    let sommeNotes = 0;
    let meilleurFilm = null;
    let meilleureNote = 0;

    films.forEach((film) => {
      if (film.nombreNotes > 0) {
        totalNotes += film.nombreNotes;
        sommeNotes += film.notesMoyenne * film.nombreNotes;

        if (film.notesMoyenne > meilleureNote) {
          meilleureNote = film.notesMoyenne;
          meilleurFilm = film;
        }
      }
    });

    const noteMoyenneGlobale = totalNotes > 0 ? sommeNotes / totalNotes : 0;

    return NextResponse.json({
      success: true,
      statistiques: {
        totalFilms,
        totalNotes,
        noteMoyenneGlobale: noteMoyenneGlobale.toFixed(2),
        meilleurFilm,
      },
    });
  } catch (error) {
    console.error('Erreur GET /api/films/statistiques:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
