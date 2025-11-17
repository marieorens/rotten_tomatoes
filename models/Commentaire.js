// models/Commentaire.js
import mongoose from 'mongoose';

const CommentaireSchema = new mongoose.Schema(
  {
    filmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Film',
      required: [true, "L'ID du film est requis"],
    },
    userId: {
      type: String,
      required: [true, "L'ID de l'utilisateur est requis"],
    },
    userName: {
      type: String,
      required: [true, "Le nom de l'utilisateur est requis"],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, "L'email de l'utilisateur est requis"],
      trim: true,
      lowercase: true,
    },
    contenu: {
      type: String,
      required: [true, 'Le contenu du commentaire est requis'],
      minlength: [3, 'Le commentaire doit contenir au moins 3 caractères'],
      maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères'],
    },
    note: {
      type: Number,
      required: [true, 'La note est requise'],
      min: [0, 'La note minimale est 0'],
      max: [10, 'La note maximale est 10'],
    },
    actif: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index pour améliorer les performances
CommentaireSchema.index({ filmId: 1, createdAt: -1 });
CommentaireSchema.index({ userId: 1 });

export default mongoose.models.Commentaire || mongoose.model('Commentaire', CommentaireSchema);
