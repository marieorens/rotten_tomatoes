/**
 * CRÉER UN FILM
 */
export async function creerFilm(filmData) {
  try {
    const response = await fetch('/api/films', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filmData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la création du film:', error);
    return { success: false, error: error.message };
  }
}

/**
 * RÉCUPÉRER UN FILM PAR ID
 */
export async function obtenirFilm(filmId) {
  try {
    const response = await fetch(`/api/films/${filmId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du film:', error);
    return { success: false, error: error.message };
  }
}

/**
 * RÉCUPÉRER TOUS LES FILMS
 */
export async function obtenirTousLesFilms(page = 1, limit = 10) {
  try {
    const response = await fetch(`/api/films?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    return { success: false, error: error.message };
  }
}

/**
 * MODIFIER UN FILM
 */
export async function modifierFilm(filmId, nouvellesDonnees) {
  try {
    const response = await fetch(`/api/films/${filmId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nouvellesDonnees),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la modification du film:', error);
    return { success: false, error: error.message };
  }
}

/**
 * SUPPRIMER UN FILM
 */
export async function supprimerFilm(filmId) {
  try {
    const response = await fetch(`/api/films/${filmId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la suppression du film:', error);
    return { success: false, error: error.message };
  }
}

/**
 * AJOUTER UN FILM DEPUIS TMDB
 */
export async function ajouterFilmDepuisTMDB(tmdbId, apiKey) {
  try {
    const response = await fetch('/api/films/tmdb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tmdbId, apiKey }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de l'ajout depuis TMDB:", error);
    return { success: false, error: error.message };
  }
}

/**
 * OBTENIR LES STATISTIQUES
 */
export async function obtenirStatistiquesFilms() {
  try {
    const response = await fetch('/api/films/statistiques');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return { success: false, error: error.message };
  }
}
