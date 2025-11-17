'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { obtenirFilm } from '@/lib/clientFilmActions';
import CommentairesSection from '@/components/CommentairesSection';
import { Star, Calendar, Clock, User, ArrowLeft } from 'lucide-react';

export default function FilmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const filmId = params.id;

  const [film, setFilm] = useState(null);
  const [chargement, setChargement] = useState(true);

  // Charger le film
  useEffect(() => {
    chargerFilm();
  }, [filmId]);

  async function chargerFilm() {
    setChargement(true);
    const result = await obtenirFilm(filmId);
    if (result.success) {
      setFilm(result.film);
    }
    setChargement(false);
  }

  if (chargement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-slate-600 mt-4 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-slate-600">Film non trouvé</p>
          <button
            onClick={() => router.push('/films')}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour aux films
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header avec bouton retour */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Détails du film */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="md:flex">
            {/* Affiche */}
            <div className="md:w-1/3">
              <img src={film.affiche} alt={film.titre} className="w-full h-full object-cover" />
            </div>

            {/* Informations */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-4xl font-bold text-slate-800 mb-4">{film.titre}</h1>

              <div className="flex items-center gap-6 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  <span className="text-2xl font-bold text-slate-800">{film.notesMoyenne}/10</span>
                  <span className="text-slate-500">({film.nombreNotes} notes)</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-5 h-5" />
                  {film.dateSortie}
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-5 h-5" />
                  {film.duree} min
                </div>
              </div>

              <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                  {film.genre}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-slate-600 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Réalisateur:</span>
                  {film.realisateur}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Synopsis</h3>
                <p className="text-slate-600 leading-relaxed">{film.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section des commentaires - Composant réutilisable */}
        <CommentairesSection filmId={filmId} />
      </div>
    </div>
  );
}
