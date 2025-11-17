import { connectDB } from '../app/api/config/db.js';
import Film from '../app/api/models/Film.js';
import { MongoClient } from 'mongodb';


//fonctions pour récupérer les données depuis le MONGO
function serializeMovie(doc) {
  return {
    _id: doc._id?.toString() || doc._id,
    titre: doc.titre,
    description: doc.description,
    genre: doc.genre,
    dateSortie: doc.dateSortie,
    realisateur: doc.realisateur,
    affiche: doc.affiche,
    duree: doc.duree,
    notesMoyenne: doc.notesMoyenne,
    nombreNotes: doc.nombreNotes,
    tmdbId: doc.tmdbId,
    actif: doc.actif,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}

export async function getMoviesFromDB(options = {}) {
  try {
    await connectDB();

    const { limit = 20, skip = 0, sortBy = 'createdAt', sortOrder = -1 } = options;

    const films = await Film.find({ actif: true })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Film.countDocuments({ actif: true });

    const serializedFilms = films.map((film) => serializeMovie(film));

    return {
      results: serializedFilms,
      total_results: total,
      page: Math.floor(skip / limit) + 1,
      total_pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error fetching movies from MongoDB:', error);
    throw error;
  }
}

export async function getMovieByIdFromDB(id) {
  try {
    await connectDB();

    const film = await Film.findById(id).lean();

    if (!film) {
      throw new Error('Film not found');
    }

    return serializeMovie(film);
  } catch (error) {
    console.error('Error fetching movie from MongoDB:', error);
    throw error;
  }
}

export async function getPopularMoviesFromDB(page = 1, limit = 20) {
  return getMoviesFromDB({
    limit,
    skip: (page - 1) * limit,
    sortBy: 'notesMoyenne',
    sortOrder: -1,
  });
}

export async function getRecommendedMoviesFromDB(excludeId, limit = 12) {
  try {
    await connectDB();

    // récupérer d'autres films actifs de notre db, en excluant le film actuel
    const films = await Film.find({
      actif: true,
      _id: { $ne: excludeId },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // convertir les films en objets JavaScript simples
    const serializedFilms = films.map((film) => serializeMovie(film));

    return {
      results: serializedFilms,
      total_results: serializedFilms.length,
      page: 1,
      total_pages: 1,
    };
  } catch (error) {
    console.error('Error fetching recommended movies from MongoDB:', error);
    throw error;
  }
}
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
    throw new Error('uri mongodb manquante dans le .env (MONGODB_URI or MONGO_URI)');
}

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;
