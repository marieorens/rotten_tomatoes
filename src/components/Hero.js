'use client';

import Image from 'next/image';

export default function Hero({ featuredMovie }) {
  if (!featuredMovie) {
    return null;
  }

  const posterUrl = featuredMovie.affiche;

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="relative top-0 left-0 mb-12 h-screen min-h-[800px] w-full overflow-hidden">
      <div className="absolute inset-0">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={featuredMovie.titre}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end max-w-8xl mx-auto">
        <div className="max-w-2xl px-8 sm:px-12 md:px-16 lg:px-20 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
          <h1 className="mb-4 text-4xl font-bold text-white drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl">
            {featuredMovie.titre}
          </h1>

          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-white/90 sm:text-base">
            <div className="flex items-center gap-1">
              <svg
                className="h-5 w-5 fill-yellow-400"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="font-semibold">
                {featuredMovie.notesMoyenne?.toFixed(1) || '0.0'}
              </span>
            </div>

            {featuredMovie.dateSortie && (
              <span className="font-medium">
                {new Date(featuredMovie.dateSortie).getFullYear()}
              </span>
            )}

            {featuredMovie.genre && (
              <span className="font-medium">{featuredMovie.genre.split(',')[0]}</span>
            )}
          </div>

          {featuredMovie.description && (
            <p className="mb-6 max-w-xl text-sm leading-relaxed text-white/90 drop-shadow-lg sm:text-base md:text-lg">
              {truncateDescription(featuredMovie.description)}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            <button className="group flex items-center gap-2 rounded-md bg-white px-6 py-3 font-semibold text-black transition-all hover:bg-white/90 hover:scale-105 active:scale-95">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play
            </button>

            <button className="group flex items-center gap-2 rounded-md border-2 border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50 hover:scale-105 active:scale-95">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 hidden aspect-[2/3] w-32 overflow-hidden rounded-lg shadow-2xl md:block lg:w-40">
        {posterUrl && (
          <Image
            src={posterUrl}
            alt={featuredMovie.titre}
            fill
            className="object-cover"
            sizes="160px"
          />
        )}
      </div>
    </div>
  );
}
