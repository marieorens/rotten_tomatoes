"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import axios from "axios";
import { getImageUrl } from "../lib/tmdb";
import MovieGrid from "./MovieGrid";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CommentairesSection from "./CommentairesSection";
import { Button } from "@/components/ui/button";
import { Star, Bookmark } from "lucide-react";

export default function MovieDetail({ movie, recommendedMovies }) {
  const { isLoggedIn, loading } = useUser();
  const [showComments, setShowComments] = useState(false);
  const [commentClickTrigger, setCommentClickTrigger] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const commentsRef = useRef(null);
  const router = useRouter();


  useEffect(() => {
    if (isLoggedIn && movie?._id) {
      checkFavorite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, movie?._id]);

  const checkFavorite = async () => {
    if (!movie?._id && !movie?.id) return;
    try {
      const response = await axios.get(
        `/api/favoris/check?filmId=${movie._id || movie.id}`,
      );
      if (response.data.success) {
        setIsFavorite(response.data.isFavorite);
      }
    } catch (error) {
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setIsLoadingFavorite(true);
    try {
      if (isFavorite) {
        await axios.delete(`/api/favoris?filmId=${movie._id || movie.id}`);
        setIsFavorite(false);
      } else {
        await axios.post("/api/favoris", { filmId: movie._id || movie.id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Erreur lors de la modification des favoris:", error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  if (!movie) return null;

  const posterUrl = movie.affiche;

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        {posterUrl && (
          <>
            <Image
              src={posterUrl}
              alt={movie.titre}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-6"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative w-64 h-96 sm:w-72 sm:h-[28rem] overflow-hidden rounded-lg shadow-2xl">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={movie.titre || movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, 288px"
                />
              ) : (
                <div className="h-full w-full bg-gray-700 flex items-center justify-center">
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
            </div>
          </div>

          <div className="flex-1 text-white">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
                {movie.titre}
              </h1>
              {isLoggedIn && (
                <button
                  onClick={toggleFavorite}
                  disabled={isLoadingFavorite}
                  className="flex-shrink-0 p-2 hover:bg-gray-800/50 rounded-lg transition-colors disabled:opacity-50"
                  title={
                    isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
                  }
                >
                  <Bookmark
                    className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                      isFavorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              )}
            </div>
            {movie.tagline && (
              <p className="text-xl text-gray-300 italic mb-6">
                {movie.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm sm:text-base">
              <div className="flex items-center gap-1">
                <svg className="h-5 w-5 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="font-semibold">
                  {movie.notesMoyenne.toFixed(1)}
                </span>
                {movie.nombreNotes > 0 && (
                  <span className="text-gray-400">
                    ({movie.nombreNotes} votes)
                  </span>
                )}
              </div>

              {movie.dateSortie && (
                <span className="text-gray-300">
                  {formatDate(movie.dateSortie)}
                </span>
              )}

              {movie.duree && (
                <span className="text-gray-300">
                  {formatRuntime(movie.duree)}
                </span>
              )}

              {movie.realisateur && movie.realisateur !== "À définir" && (
                <span className="text-gray-300">
                  Dirigé par{" "}
                  <span className="font-semibold text-white">
                    {movie.realisateur}
                  </span>
                </span>
              )}
            </div>

            {movie.genre && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.split(",").map((genreName, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-200"
                  >
                    {genreName.trim()}
                  </span>
                ))}
              </div>
            )}

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {(movie.description || movie.overview) && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-3">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {movie.description}
                </p>
              </div>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {movie.cast.slice(0, 10).map((actor) => (
                    <div key={actor.id} className="flex-shrink-0 text-center">
                      <Avatar className="w-14 h-14 sm:w-16 sm:h-16 mb-2 mx-auto">
                        {actor.profile_path && (
                          <AvatarImage
                            src={getImageUrl(actor.profile_path, "w185")}
                            alt={actor.name}
                          />
                        )}
                        <AvatarFallback className="bg-gray-700 text-gray-300">
                          {actor.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-gray-300 font-medium">
                        {actor.name}
                      </p>
                      <p className="text-xs text-gray-500">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* <div className="flex flex-wrap gap-4">
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition-colors"
                >
                  Site officiel
                </a>
              )}
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border-2 border-white/30 bg-white/10 text-white rounded-md font-semibold hover:bg-white/20 transition-colors"
                >
                  Voir sur IMDb
                </a>
              )}
            </div> */}
          </div>
        </div>

        <div className="mt-12 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {/* <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" /> */}
                <div>
                  <p className="text-sm text-gray-400">Note moyenne</p>
                  <p className="text-2xl font-bold text-white">
                    {movie.notesMoyenne?.toFixed(1) || "0.0"}
                    <span className="text-2xl text-white font-bold">/5</span>
                  </p>
                  {movie.nombreNotes > 0 && (
                    <p className="text-xs text-gray-500">
                      {movie.nombreNotes} avis
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-blue-600/50"
                onClick={() => {
                  if (!isLoggedIn && !loading) {
                    router.push("/login");
                    return;
                  }
                  setCommentClickTrigger((prev) => prev + 1);
                }}
              >
                Donner son avis
              </Button>
            </div>
          </div>
        </div>

        <div ref={commentsRef} className="mt-12">
          <CommentairesSection
            filmId={movie._id || movie.id}
            onCommentClick={commentClickTrigger}
          />
        </div>

        {recommendedMovies &&
          recommendedMovies.results &&
          recommendedMovies.results.length > 0 && (
            <div className="mt-16">
              <MovieGrid movies={recommendedMovies} title="Films recommandés" />
            </div>
          )}
      </div>
    </>
  );
}
