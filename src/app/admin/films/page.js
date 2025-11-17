'use client';

import { useState, useEffect } from 'react';
import {
  creerFilm,
  obtenirTousLesFilms,
  modifierFilm,
  supprimerFilm,
  ajouterFilmDepuisTMDB,
  obtenirStatistiquesFilms,
} from '@/lib/clientFilmActions';
import { Plus, Edit, Trash2, Download, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Image from 'next/image';

export default function AdminFilmsPage() {
  const [films, setFilms] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [dialogTmdbOpen, setDialogTmdbOpen] = useState(false);
  const [filmSelectionne, setFilmSelectionne] = useState(null);
  const [statistiques, setStatistiques] = useState(null);
  const [tmdbId, setTmdbId] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [formulaire, setFormulaire] = useState({
    titre: '',
    description: '',
    genre: '',
    dateSortie: '',
    realisateur: '',
    affiche: '',
    duree: '',
  });

  async function chargerFilms(pageNum = page) {
    setChargement(true);
    const resultat = await obtenirTousLesFilms(pageNum, 10);
    if (resultat.success) {
      setFilms(resultat.films);
      if (resultat.pagination) {
        setPagination(resultat.pagination);
      }
    } else {
      toast.error('Erreur lors du chargement des films');
    }
    setChargement(false);
  }

  async function chargerStatistiques() {
    const resultat = await obtenirStatistiquesFilms();
    if (resultat.success) {
      setStatistiques(resultat.statistiques);
    }
  }

  useEffect(() => {
    chargerFilms(page);
    chargerStatistiques();
  }, [page]);

  function handleChange(e) {
    setFormulaire({
      ...formulaire,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCreerFilm(e) {
    e.preventDefault();
    const resultat = await creerFilm(formulaire);

    if (resultat.success) {
      toast.success('Film créé avec succès !');
      reinitialiserFormulaire();
      setDialogOpen(false);
      chargerFilms(page);
      chargerStatistiques();
    } else {
      toast.error('Erreur: ' + resultat.error);
    }
  }

  async function handleModifierFilm(e) {
    e.preventDefault();
    const resultat = await modifierFilm(filmSelectionne._id, formulaire);

    if (resultat.success) {
      toast.success('Film modifié avec succès !');
      reinitialiserFormulaire();
      setDialogOpen(false);
      chargerFilms(page);
      chargerStatistiques();
    } else {
      toast.error('Erreur: ' + resultat.error);
    }
  }

  function preparerEdition(film) {
    setFilmSelectionne(film);
    setFormulaire({
      titre: film.titre,
      description: film.description,
      genre: film.genre,
      dateSortie: film.dateSortie,
      realisateur: film.realisateur,
      affiche: film.affiche,
      duree: film.duree,
    });
    setDialogOpen(true);
  }

  async function handleSupprimerFilm() {
    const resultat = await supprimerFilm(filmSelectionne._id);

    if (resultat.success) {
      toast.success('Film supprimé avec succès !');
      setDialogDeleteOpen(false);
      setFilmSelectionne(null);
      chargerFilms(page);
      chargerStatistiques();
    } else {
      toast.error('Erreur: ' + resultat.error);
    }
  }

  function ouvrirDialogSuppression(film) {
    setFilmSelectionne(film);
    setDialogDeleteOpen(true);
  }

  async function handleAjouterDepuisTMDB() {
    if (!tmdbId) {
      toast.error('Veuillez entrer un ID TMDB');
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const resultat = await ajouterFilmDepuisTMDB(tmdbId, apiKey);

    if (resultat.success) {
      toast.success('Film ajouté depuis TMDB avec succès !');
      setTmdbId('');
      setDialogTmdbOpen(false);
      chargerFilms(page);
      chargerStatistiques();
    } else {
      toast.error('Erreur: ' + resultat.error);
    }
  }

  function reinitialiserFormulaire() {
    setFormulaire({
      titre: '',
      description: '',
      genre: '',
      dateSortie: '',
      realisateur: '',
      affiche: '',
      duree: '',
    });
    setFilmSelectionne(null);
  }

  function ouvrirDialogNouveau() {
    reinitialiserFormulaire();
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-3">Administration des films</h1>
        <p className="text-muted-foreground mt-2">Gérez votre catalogue de films</p>
      </div>

      {statistiques && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total des films</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistiques.totalFilms}</div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total des notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistiques.totalNotes}</div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistiques.noteMoyenneGlobale}/10</div>
            </CardContent>
          </Card>

          {statistiques.meilleurFilm && (
            <Card className="shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Le meilleur film</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold truncate mb-2">
                  {statistiques.meilleurFilm.titre}{' '}
                  <span className="text-sm text-muted-foreground">
                    ({statistiques.meilleurFilm.notesMoyenne}/10)
                  </span>
                </div>
                {/* <div className="text-2xl font-bold">{statistiques.meilleurFilm.notesMoyenne}/10</div> */}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={ouvrirDialogNouveau}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un film
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {filmSelectionne ? 'Modifier le film' : 'Ajouter un nouveau film'}
              </DialogTitle>
              <DialogDescription>
                {filmSelectionne
                  ? 'Modifiez les informations du film'
                  : 'Remplissez les informations pour ajouter un nouveau film'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={filmSelectionne ? handleModifierFilm : handleCreerFilm}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="titre">Titre *</Label>
                  <Input
                    id="titre"
                    name="titre"
                    value={formulaire.titre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formulaire.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="genre">Genre *</Label>
                    <Input
                      id="genre"
                      name="genre"
                      value={formulaire.genre}
                      onChange={handleChange}
                      required
                      placeholder="Action, Drame, Comédie..."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="realisateur">Réalisateur *</Label>
                    <Input
                      id="realisateur"
                      name="realisateur"
                      value={formulaire.realisateur}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dateSortie">Date de sortie *</Label>
                    <Input
                      id="dateSortie"
                      name="dateSortie"
                      type="date"
                      value={formulaire.dateSortie}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="duree">Durée (minutes) *</Label>
                    <Input
                      id="duree"
                      name="duree"
                      type="number"
                      value={formulaire.duree}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="affiche">URL de l'affiche *</Label>
                  <Input
                    id="affiche"
                    name="affiche"
                    type="url"
                    value={formulaire.affiche}
                    onChange={handleChange}
                    required
                    placeholder="https://..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">{filmSelectionne ? 'Modifier' : 'Créer'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={dialogTmdbOpen} onOpenChange={setDialogTmdbOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Importer depuis TMDB
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Importer depuis TMDB</DialogTitle>
              <DialogDescription>
                Entrez l'ID du film sur TMDB pour l'importer automatiquement
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tmdbId">ID TMDB</Label>
                <Input
                  id="tmdbId"
                  placeholder="Ex: 550"
                  value={tmdbId}
                  onChange={(e) => setTmdbId(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogTmdbOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAjouterDepuisTMDB}>Importer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-8 mt-8 flex items-center gap-2">
          Liste des films ({pagination.total})
        </h2>

        {chargement ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-none">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Skeleton className="w-32 h-48 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {films.map((film) => (
              <Card key={film._id} className="shadow-none">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-32 h-48 flex-shrink-0">
                      <Image
                        src={film.affiche}
                        alt={film.titre}
                        fill
                        className="object-cover rounded-lg"
                        sizes="128px"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3">{film.titre}</h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">Réalisateur:</span>
                          {film.realisateur}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">Genre:</span>
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                            {film.genre}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">Sortie:</span>
                          {film.dateSortie}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">Durée:</span>
                          {film.duree} min
                        </p>
                        <p className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-foreground">{film.notesMoyenne}/10</span>
                          <span className="text-sm text-muted-foreground">
                            ({film.nombreNotes} notes)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-3">
                      <Button
                        variant="outline"
                        onClick={() => preparerEdition(film)}
                        className="w-full"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => ouvrirDialogSuppression(film)}
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(pageNum);
                          }}
                          isActive={page === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < pagination.totalPages) setPage(page + 1);
                    }}
                    className={
                      page === pagination.totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <Dialog open={dialogDeleteOpen} onOpenChange={setDialogDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le film</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer &quot;{filmSelectionne?.titre}&quot; ? Cette action
              est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogDeleteOpen(false)}>
              Annuler
            </Button>
            <Button type="button" variant="destructive" onClick={handleSupprimerFilm}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
