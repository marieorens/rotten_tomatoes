import Image from 'next/image';
import Link from 'next/link';

export default function MovieCard({ movie }) {
  const movieId = movie._id?.toString();

  return (
    <Link href={`/movie/${movieId}`}>
      <div className="cursor-pointer group relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-700">
          {movie.affiche ? (
            <Image
              src={movie.affiche}
              alt={movie.titre}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                className="h-16 w-16 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h3 className="mb-2 text-lg font-bold line-clamp-2 drop-shadow-lg">{movie.titre}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <svg
                className="h-4 w-4 fill-yellow-400"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="text-sm font-semibold">
                {movie.notesMoyenne?.toFixed(1) || '0.0'}
              </span>
            </div>
            {movie.nombreNotes > 0 && (
              <span className="text-xs text-gray-300">({movie.nombreNotes} votes)</span>
            )}
          </div>
          {movie.dateSortie && (
            <p className="mt-1 text-xs text-gray-300">{new Date(movie.dateSortie).getFullYear()}</p>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-white">{movie.titre}</h3>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 backdrop-blur-sm">
          <svg
            className="h-3 w-3 fill-yellow-400"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          <span className="text-xs font-semibold text-white">
            {movie.notesMoyenne?.toFixed(1) || '0.0'}
          </span>
        </div>
      </div>
    </Link>
  );
}
