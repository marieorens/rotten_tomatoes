import { getMovieByIdFromDB, getRecommendedMoviesFromDB } from '../../../lib/mongodb';
import { getMovieCredits } from '../../../lib/tmdb';
import MovieDetail from '../../../components/MovieDetail';
import Header from '../../../components/Header';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const movieId = String(id);
    const movie = await getMovieByIdFromDB(movieId);
    return {
      title: `${movie.titre} - Movie App`,
      description: movie.description || 'Discover movie details',
    };
  } catch {
    return {
      title: 'Movie Not Found - Movie App',
    };
  }
}

export default async function MoviePage({ params }) {
  let movie = null;
  let credits = null;
  let recommendedMovies = null;
  let error = null;

  const { id } = await params;
  const movieId = String(id);

  try {
    movie = await getMovieByIdFromDB(movieId);

    if (!movie) {
      notFound();
    }

    if (movie.tmdbId) {
      try {
        credits = await getMovieCredits(movie.tmdbId).catch(() => null);
        if (credits) {
          movie.cast = credits.cast || [];
          movie.crew = credits.crew || [];
        }
      } catch (tmdbError) {
        console.warn('Could not fetch TMDB credits:', tmdbError);
      }
    }

    recommendedMovies = await getRecommendedMoviesFromDB(movieId, 12).catch(() => null);
  } catch (err) {
    error = err.message;
    console.error('Error loading movie:', err);
    notFound();
  }

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="relative">
        <Header />
      </div>

      <main>
        <MovieDetail movie={movie} recommendedMovies={recommendedMovies} />
      </main>
    </div>
  );
}
