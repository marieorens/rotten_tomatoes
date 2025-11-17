// app/api/commentaires/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../config/db';
import Film from '../../models/Film';
import Commentaire from '../../models/Commentaire';

// PUT - Modifier un commentaire
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { userId, contenu, note } = await request.json();

    // Vérifier que l'utilisateur est bien le propriétaire
    const commentaire = await Commentaire.findOne({
      _id: id,
      userId,
    });

    if (!commentaire) {
      return NextResponse.json(
        {
          success: false,
          error: "Commentaire non trouvé ou vous n'êtes pas autorisé",
        },
        { status: 403 },
      );
    }

    // Mettre à jour le commentaire
    const commentaireModifie = await Commentaire.findByIdAndUpdate(
      id,
      { contenu, note },
      { new: true, runValidators: true },
    );

    // Mettre à jour la note moyenne du film
    await mettreAJourNoteFilm(commentaire.filmId);

    return NextResponse.json({
      success: true,
      commentaire: commentaireModifie,
    });
  } catch (error) {
    console.error('Erreur PUT /api/commentaires/[id]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Supprimer un commentaire
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Vérifier que l'utilisateur est bien le propriétaire
    const commentaire = await Commentaire.findOne({
      _id: params.id,
      userId,
    });

    if (!commentaire) {
      return NextResponse.json(
        {
          success: false,
          error: "Commentaire non trouvé ou vous n'êtes pas autorisé",
        },
        { status: 403 },
      );
    }

    const filmId = commentaire.filmId;

    // Supprimer le commentaire
    await Commentaire.findByIdAndDelete(params.id);

    // Mettre à jour la note moyenne du film
    await mettreAJourNoteFilm(filmId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Erreur DELETE /api/commentaires/[id]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Fonction helper pour mettre à jour la note
async function mettreAJourNoteFilm(filmId) {
  try {
    const commentaires = await Commentaire.find({
      filmId,
      actif: true,
    });

    const nombreNotes = commentaires.length;
    const sommeNotes = commentaires.reduce((sum, c) => sum + c.note, 0);
    const notesMoyenne = nombreNotes > 0 ? sommeNotes / nombreNotes : 0;

    await Film.findByIdAndUpdate(filmId, {
      notesMoyenne: Math.round(notesMoyenne * 10) / 10,
      nombreNotes,
    });

    return true;
  } catch (error) {
    console.error('Erreur mise à jour note:', error);
    return false;
  }
}
