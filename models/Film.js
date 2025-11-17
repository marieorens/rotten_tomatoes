// models/Film.js
import mongoose from 'mongoose';

const FilmSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
    },
    genre: {
      type: String,
      required: [true, 'Le genre est requis'],
    },
    dateSortie: {
      type: String,
      required: [true, 'La date de sortie est requise'],
    },
    realisateur: {
      type: String,
      required: [true, 'Le réalisateur est requis'],
    },
    affiche: {
      type: String,
      required: [true, "L'URL de l'affiche est requise"],
    },
    duree: {
      type: Number,
      required: [true, 'La durée est requise'],
    },
    notesMoyenne: {
      type: Number,
      default: 0,
    },
    nombreNotes: {
      type: Number,
      default: 0,
    },
    tmdbId: {
      type: String,
      default: null,
    },
    actif: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  },
);

// Index pour améliorer les performances de recherche
FilmSchema.index({ titre: 'text', description: 'text' });
FilmSchema.index({ genre: 1 });
FilmSchema.index({ realisateur: 1 });

const Film =
  mongoose.models && mongoose.models.Film
    ? mongoose.models.Film
    : mongoose.model('Film', FilmSchema);

export default Film;
