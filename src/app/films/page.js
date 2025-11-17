// app/films/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { obtenirTousLesFilms } from '@/lib/clientFilmActions';
import { Film, Star, Clock, Calendar, Search, User } from 'lucide-react';

export default function FilmsPage() {
    const router = useRouter();
    const [films, setFilms] = useState([]);
    const [filmsAffichés, setFilmsAffichés] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [recherche, setRecherche] = useState('');
    const [genre, setGenre] = useState('');
    const [realisateur, setRealisateur] = useState('');
    const [triDate, setTriDate] = useState(''); // 'recent' ou 'ancien'
    const [genres, setGenres] = useState([]);
    const [realisateurs, setRealisateurs] = useState([]);

    useEffect(() => {
        chargerFilms();
    }, []);

    useEffect(() => {
        filtrerFilms();
    }, [recherche, films, genre, realisateur, triDate]);

    async function chargerFilms() {
        setChargement(true);
        const resultat = await obtenirTousLesFilms();
        if (resultat.success) {
            setFilms(resultat.films);
            setFilmsAffichés(resultat.films);

            // Extraire les genres uniques
            const genresUniques = [...new Set(resultat.films.map(film => film.genre))];
            setGenres(genresUniques);

            // Extraire les réalisateurs uniques
            const realisateursUniques = [...new Set(resultat.films.map(film => film.realisateur))].sort();
            setRealisateurs(realisateursUniques);
        }
        setChargement(false);
    }

    function filtrerFilms() {
        let filmsFiltres = [...films];

        // Filtre par recherche
        if (recherche.trim() !== '') {
            const rechercheLower = recherche.toLowerCase();
            filmsFiltres = filmsFiltres.filter(film =>
                film.titre.toLowerCase().includes(rechercheLower) ||
                film.genre.toLowerCase().includes(rechercheLower) ||
                film.realisateur.toLowerCase().includes(rechercheLower)
            );
        }

        // Filtre par genre
        if (genre !== '') {
            filmsFiltres = filmsFiltres.filter(film => film.genre === genre);
        }

        // Filtre par réalisateur
        if (realisateur !== '') {
            filmsFiltres = filmsFiltres.filter(film => film.realisateur === realisateur);
        }

        // Tri par date
        if (triDate === 'recent') {
            filmsFiltres.sort((a, b) => new Date(b.dateSortie) - new Date(a.dateSortie));
        } else if (triDate === 'ancien') {
            filmsFiltres.sort((a, b) => new Date(a.dateSortie) - new Date(b.dateSortie));
        }

        setFilmsAffichés(filmsFiltres);
    }

    function naviguerVersFilm(filmId) {
        router.push(`/films/${filmId}`);
    }

    function reinitialiserFiltres() {
        setRecherche('');
        setGenre('');
        setRealisateur('');
        setTriDate('');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Film className="w-10 h-10 text-blue-600" />
                            <div>
                                <h1 className="text-4xl font-bold text-slate-800">Catalogue de Films</h1>
                                <p className="text-slate-600 mt-1">Découvrez et donnez votre avis</p>
                            </div>
                        </div>
                    </div>

                    {/* Barre de recherche */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un film, genre ou réalisateur..."
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        />
                    </div>

                    {/* Filtres */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Filtre par genre */}
                        <select
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="w-full pl-4 pr-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        >
                            <option value="">Tous les genres</option>
                            {genres.map((g, index) => (
                                <option key={index} value={g}>{g}</option>
                            ))}
                        </select>

                        {/* Filtre par réalisateur */}
                        <select
                            value={realisateur}
                            onChange={(e) => setRealisateur(e.target.value)}
                            className="w-full pl-4 pr-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        >
                            <option value="">Tous les réalisateurs</option>
                            {realisateurs.map((r, index) => (
                                <option key={index} value={r}>{r}</option>
                            ))}
                        </select>

                        {/* Tri par date */}
                        <select
                            value={triDate}
                            onChange={(e) => setTriDate(e.target.value)}
                            className="w-full pl-4 pr-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        >
                            <option value="">Trier par date</option>
                            <option value="recent">Plus récents</option>
                            <option value="ancien">Plus anciens</option>
                        </select>
                    </div>

                    {/* Bouton réinitialiser */}
                    {(recherche || genre || realisateur || triDate) && (
                        <button
                            onClick={reinitialiserFiltres}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Réinitialiser tous les filtres
                        </button>
                    )}
                </div>
            </div>

            {/* Liste des films */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {chargement ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="text-slate-600 mt-4 text-lg">Chargement des films...</p>
                    </div>
                ) : filmsAffichés.length === 0 ? (
                    <div className="text-center py-20">
                        <Film className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-xl">
                            {recherche || genre || realisateur ? 'Aucun film trouvé' : 'Aucun film disponible'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <p className="text-slate-600">
                                <span className="font-semibold text-slate-800">{filmsAffichés.length}</span>{' '}
                                film{filmsAffichés.length > 1 ? 's' : ''} trouvé{filmsAffichés.length > 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filmsAffichés.map((film) => (
                                <div
                                    key={film._id}
                                    onClick={() => naviguerVersFilm(film._id)}
                                    className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
                                >
                                    {/* Image du film */}
                                    <div className="relative h-80 overflow-hidden">
                                        <img
                                            src={film.affiche}
                                            alt={film.titre}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        {/* Badge note */}
                                        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-1">
                                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                            <span className="text-white font-bold">{film.notesMoyenne || 0}</span>
                                        </div>
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                                    Voir les détails
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Informations */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">
                                            {film.titre}
                                        </h3>
                                        <div className="space-y-2 text-sm text-slate-600">
                                            <p className="flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                                    {film.genre}
                                                </span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-slate-400" />
                                                <span className="line-clamp-1">{film.realisateur}</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {film.dateSortie}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                {film.duree} min
                                            </p>
                                            <p className="text-slate-500 text-xs">
                                                {film.nombreNotes} avis
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}