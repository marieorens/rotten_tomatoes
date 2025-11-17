/**
 * RÉCUPÉRER TOUS LES UTILISATEURS
 */
export async function obtenirTousLesUsers(page = 1, limit = 10) {
  try {
    const response = await fetch(`/api/admin/users?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return { success: false, error: error.message };
  }
}

/**
 * CRÉER UN UTILISATEUR
 */
export async function creerUser(userData) {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return { success: false, error: error.message };
  }
}

/**
 * MODIFIER UN UTILISATEUR
 */
export async function modifierUser(userId, nouvellesDonnees) {
  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nouvellesDonnees),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la modification de l'utilisateur:", error);
    return { success: false, error: error.message };
  }
}

/**
 * SUPPRIMER UN UTILISATEUR
 */
export async function supprimerUser(userId) {
  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return { success: false, error: error.message };
  }
}
