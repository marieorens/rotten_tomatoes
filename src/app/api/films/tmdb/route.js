import { NextResponse } from 'next/server';
import {connectDB} from "../../config/db";
import Film from "../../models/Film"
import {TMDB_API_BASE_URL, TMDB_API_KEY, TMDB_API_VERSION} from "@/config/tmdb";

// POST - Ajouter un film depuis TMDB
export async function POST(request) {
  try {
    const { tmdbId, apiKey } = await request.json();

    // Récupérer les données depuis TMDB
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=fr-FR`,
    );


        if (!response.ok) {
            throw new Error('Film non trouvé sur TMDB');
        }

        const response1= await fetch (
            `https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${apiKey}&language=fr-FR`,
        )

        const director= await response1.json()
        const director1= director.crew?.find(person => person.job === 'Director');
//         console.log(director1);

        const tmdbData = await response.json();

    // Créer le film dans MongoDB
    await connectDB();

        const film = await Film.create({
            titre: tmdbData.title,
            description: tmdbData.overview,
            genre: tmdbData.genres.map(g => g.name).join(', '),
            dateSortie: tmdbData.release_date,
            affiche: `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
            duree: tmdbData.runtime,
            tmdbId: tmdbId,
            realisateur: director1.name
        });

    return NextResponse.json({
      success: true,
      filmId: film._id.toString(),
      film,
    });
  } catch (error) {
    console.error('Erreur POST /api/films/tmdb:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
