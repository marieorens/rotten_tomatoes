import {
  TMDB_API_KEY,
  TMDB_API_VERSION,
  TMDB_API_BASE_URL,
  TMDB_IMAGE_BASE_URL,
} from '../config/tmdb';

//construit l'URL complète d'une image TMDB
export function getImageUrl(path, size = 'w342') {
  if (!path) return '/placeholder-movie.jpg';
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
}

//récupère les crédits (cast et crew) d'un film
export async function getMovieCredits(id) {
  try {
    const response = await fetch(
      `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/${id}/credits?api_key=${TMDB_API_KEY}`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movie credits');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    throw error;
  }
}
