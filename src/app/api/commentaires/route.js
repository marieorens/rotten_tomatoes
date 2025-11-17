import { NextResponse } from "next/server";
import { connectDB } from "../config/db.js";
import Film from "../models/Film";
import Commentaire from "../models/Commentaire";
import axios from "axios";

export async function POST(request) {
  try {
    await connectDB();
    const commentaireData = await request.json();

    let userInfos = {};
    if (commentaireData.firebaseToken) {
      const verifyRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/firebase-verify`,
        { token: commentaireData.firebaseToken }
      );
      if (verifyRes.data.user) {
        userInfos = {
          userId: verifyRes.data.user.uid,
          userName: verifyRes.data.user.name || verifyRes.data.user.email,
          userEmail: verifyRes.data.user.email,
        };
      } else {
        return NextResponse.json({ success: false, error: "Utilisateur non authentifié" }, { status: 401 });
      }
    } else {
      userInfos = {
        userId: commentaireData.userId,
        userName: commentaireData.userName,
        userEmail: commentaireData.userEmail,
      };
    }

    const commentaire = await Commentaire.create({
      filmId: commentaireData.filmId,
      ...userInfos,
      contenu: commentaireData.contenu,
      note: commentaireData.note,
    });

    await mettreAJourNoteFilm(commentaireData.filmId);

    return NextResponse.json({
      success: true,
      commentaireId: commentaire._id.toString(),
      commentaire,
    });
  } catch (error) {
    console.error("Erreur POST /api/commentaires:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

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
    console.error("Erreur mise à jour note:", error);
    return false;
  }
}
