import { getPopularMoviesFromDB } from '../lib/mongodb';
import MovieGrid from '../components/MovieGrid';
import Header from '../components/Header';
import Hero from '../components/Hero';

export const metadata = {
  title: 'Movie App',
  description: 'Discover the latest movies and TV shows',
};

export default async function Home() {
  let movies = null;
  let error = null;
  let featuredMovie = null;

  try {
    movies = await getPopularMoviesFromDB(1);
    // Le premier film de la liste devient le film en vedette
    if (movies && movies.results && movies.results.length > 0) {
      featuredMovie = movies.results[0];
    }
  } catch (err) {
    error = err.message;
    console.error('Error loading movies:', err);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="relative">
        <Hero featuredMovie={featuredMovie} />
        <Header />
      </div>

      <main className="relative">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {error ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="rounded-lg bg-red-900/50 p-6 text-center">
                <p className="text-lg font-semibold text-red-200">
                  Erreur lors du chargement des films
                </p>
                <p className="mt-2 text-sm text-red-300">{error}</p>
                <p className="mt-4 text-xs text-red-400">
                  Vérifiez que votre base de données MongoDB est correctement configurée.
                </p>
              </div>
            </div>
          ) : (
            <MovieGrid movies={movies} title="Trending Movies" />
          )}
        </div>
      </main>
    </div>
  );
}
