'use client';

import { useState, useEffect } from 'react';
import {
  obtenirTousLesUsers,
  creerUser,
  modifierUser,
  supprimerUser,
} from '@/lib/clientUserActions';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [userSelectionne, setUserSelectionne] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [formulaire, setFormulaire] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  async function chargerUsers(pageNum = page) {
    setChargement(true);
    const resultat = await obtenirTousLesUsers(pageNum, 10);
    if (resultat.success) {
      setUsers(resultat.users);
      if (resultat.pagination) {
        setPagination(resultat.pagination);
      }
    } else {
      toast.error('Erreur lors du chargement des utilisateurs');
    }
    setChargement(false);
  }

  useEffect(() => {
    chargerUsers(page);
  }, [page]);

  function handleChange(e) {
    setFormulaire({
      ...formulaire,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCreerUser(e) {
    e.preventDefault();
    const resultat = await creerUser(formulaire);

    if (resultat.success) {
      toast.success('Utilisateur créé avec succès !');
      reinitialiserFormulaire();
      setDialogOpen(false);
      chargerUsers(page);
    } else {
      toast.error('Erreur: ' + resultat.error);
    }
  }

  async function handleModifierUser(e) {
    e.preventDefault();
    const resultat = await modifierUser(userSelectionne._id, formulaire);

    if (resultat.success) {
      toast.success('Utilisateur modifié avec succès !');
      reinitialiserFormulaire();
      setDialogOpen(false);
      chargerUsers(page);
    } else {
      toast.error('Erreur: ' + resultat.error);
    }
  }

  function preparerEdition(user) {
    setUserSelectionne(user);
    setFormulaire({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role || 'user',
    });
    setDialogOpen(true);
  }

  async function handleSupprimerUser() {
    const resultat = await supprimerUser(userSelectionne._id);

    if (resultat.success) {
      toast.success('Utilisateur supprimé avec succès !');
      setDialogDeleteOpen(false);
      setUserSelectionne(null);
      chargerUsers(page);
    } else {
      toast.error('Erreur: ' + resultat.error);
    }
  }

  function ouvrirDialogSuppression(user) {
    setUserSelectionne(user);
    setDialogDeleteOpen(true);
  }

  function reinitialiserFormulaire() {
    setFormulaire({
      username: '',
      email: '',
      password: '',
      role: 'user',
    });
    setUserSelectionne(null);
  }

  function ouvrirDialogNouveau() {
    reinitialiserFormulaire();
    setDialogOpen(true);
  }

  async function promouvoirUser(user) {
    const resultat = await modifierUser(user._id, { role: 'admin' });

    if (resultat.success) {
      toast.success('Utilisateur promu administrateur avec succès !');
      chargerUsers(page);
    } else {
      toast.error('Erreur: ' + resultat.error);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-3">Gérer vos utilisateurs</h1>
        <p className="text-muted-foreground mt-2">Gérez les utilisateurs de l'application</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role !== 'admin').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={ouvrirDialogNouveau}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {userSelectionne ? "Modifier l'utilisateur" : 'Ajouter un nouvel utilisateur'}
              </DialogTitle>
              <DialogDescription>
                {userSelectionne
                  ? "Modifiez les informations de l'utilisateur"
                  : 'Remplissez les informations pour créer un nouvel utilisateur'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={userSelectionne ? handleModifierUser : handleCreerUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Nom d'utilisateur *</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formulaire.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formulaire.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">
                    Mot de passe {userSelectionne ? '(laisser vide pour ne pas modifier)' : '*'}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formulaire.password}
                    onChange={handleChange}
                    required={!userSelectionne}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">Rôle *</Label>
                  <Select
                    value={formulaire.role}
                    onValueChange={(value) => setFormulaire({ ...formulaire, role: value })}
                    required
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">{userSelectionne ? 'Modifier' : 'Créer'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-8 mt-8">
          Liste des utilisateurs ({pagination.total})
        </h2>

        {chargement ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-none">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {users.map((user) => (
              <Card key={user._id} className="shadow-none">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{user.username}</h3>
                      <div className="space-y-1 text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">Email:</span>
                          {user.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">Rôle:</span>
                          {user.role === 'admin' ? (
                            <span className="flex items-center gap-1 text-primary font-semibold">
                              Administrateur
                            </span>
                          ) : (
                            <span>Utilisateur</span>
                          )}
                        </p>
                        {user.createdAt && (
                          <p className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">Inscrit le:</span>
                            {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => preparerEdition(user)}
                        className="w-full md:w-auto"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                      {user.role !== 'admin' && (
                        <Button
                          variant="outline"
                          onClick={() => promouvoirUser(user)}
                          className="w-full md:w-auto"
                        >
                          Promouvoir
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => ouvrirDialogSuppression(user)}
                        className="w-full md:w-auto"
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
            <DialogTitle>Supprimer l&apos;utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer &quot;{userSelectionne?.username}&quot; ? Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogDeleteOpen(false)}>
              Annuler
            </Button>
            <Button type="button" variant="destructive" onClick={handleSupprimerUser}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
