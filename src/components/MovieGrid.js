import MovieCard from './MovieCard';

export default function MovieGrid({ movies, title = 'Trending Movies' }) {
  if (!movies || !movies.results || movies.results.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-400">Aucun film trouvé</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="pb-3 flex items-center gap-2 justify-between">
        <h2 className="mb-6 text-3xl font-bold text-white">{title}</h2>
        <button className="text-white">See more</button>
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.results.map((movie) => (
          <MovieCard key={movie._id?.toString()} movie={movie} />
        ))}
      </div>
    </div>
  );
}
