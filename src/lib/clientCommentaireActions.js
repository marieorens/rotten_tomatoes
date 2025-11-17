// lib/clientCommentaireActions.js
// Actions côté client qui appellent les API routes

/**
 * CRÉER UN COMMENTAIRE
 */
import { getAuth } from "firebase/auth";

export async function creerCommentaire(commentaireData) {
  try {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      const token = await firebaseUser.getIdToken();
      commentaireData.firebaseToken = token;
    }
    const response = await fetch("/api/commentaires", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentaireData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);
    return { success: false, error: error.message };
  }
}

/**
 * RÉCUPÉRER LES COMMENTAIRES D'UN FILM
 */
export async function obtenirCommentairesFilm(filmId) {
  try {
    const response = await fetch(`/api/commentaires/film/${filmId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    return { success: false, error: error.message };
  }
}

/**
 * MODIFIER UN COMMENTAIRE
 */
export async function modifierCommentaire(
  commentaireId,
  userId,
  nouvellesDonnees,
) {
  try {
    const response = await fetch(`/api/commentaires/${commentaireId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        ...nouvellesDonnees,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la modification du commentaire:", error);
    return { success: false, error: error.message };
  }
}

/**
 * SUPPRIMER UN COMMENTAIRE
 */
export async function supprimerCommentaire(commentaireId, userId) {
  try {
    const response = await fetch(
      `/api/commentaires/${commentaireId}?userId=${userId}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
    return { success: false, error: error.message };
  }
}
