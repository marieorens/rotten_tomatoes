"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import {
  creerCommentaire,
  obtenirCommentairesFilm,
  modifierCommentaire,
  supprimerCommentaire,
} from "@/lib/clientCommentaireActions";
import { Star, Edit2, Trash2, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CommentairesSection({ filmId, onCommentClick }) {
  const [commentaires, setCommentaires] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [modeEdition, setModeEdition] = useState(false);
  const [commentaireEdite, setCommentaireEdite] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { user: utilisateur, isLoggedIn } = useUser();

  const [formulaire, setFormulaire] = useState({
    contenu: "",
    note: 0,
  });

  useEffect(() => {
    if (onCommentClick) {
      const timer = setTimeout(() => {
        setIsCommentModalOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [onCommentClick]);

  const chargerCommentaires = useCallback(async () => {
    setChargement(true);
    const result = await obtenirCommentairesFilm(filmId);
    if (result.success) {
      setCommentaires(result.commentaires);
    }
    setChargement(false);
  }, [filmId]);

  useEffect(() => {
    const loadComments = async () => {
      await chargerCommentaires();
    };
    loadComments();
  }, [chargerCommentaires]);

  function handleChange(e) {
    setFormulaire({
      ...formulaire,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSoumettreCommentaire(e) {
    e.preventDefault();

    if (formulaire.note === 0 || formulaire.note < 1 || formulaire.note > 5) {
      alert("Veuillez sélectionner une note entre 1 et 5 étoiles");
      return;
    }

    if (modeEdition) {
      // Modifier le commentaire
      const resultat = await modifierCommentaire(
        commentaireEdite._id,
        utilisateur.id,
        formulaire,
      );

      if (resultat.success) {
        alert("Commentaire modifié avec succès !");
        reinitialiserFormulaire();
        setIsCommentModalOpen(false);
        chargerCommentaires();
      } else {
        alert("Erreur: " + resultat.error);
      }
    } else {
      const resultat = await creerCommentaire({
        filmId,
        userId: utilisateur.id,
        userName: utilisateur.nom,
        userEmail: utilisateur.email,
        contenu: formulaire.contenu,
        note: parseInt(formulaire.note),
      });

      if (resultat.success) {
        alert("Commentaire ajouté avec succès !");
        reinitialiserFormulaire();
        setIsCommentModalOpen(false);
        chargerCommentaires();
      } else {
        alert("Erreur: " + resultat.error);
      }
    }
  }

  function preparerEdition(commentaire) {
    setModeEdition(true);
    setCommentaireEdite(commentaire);
    setFormulaire({
      contenu: commentaire.contenu,
      note: commentaire.note,
    });
    setIsCommentModalOpen(true);
  }

  async function handleSupprimerCommentaire(commentaireId) {
    if (!confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
      return;
    }

    const resultat = await supprimerCommentaire(commentaireId, utilisateur.id);

    if (resultat.success) {
      alert("Commentaire supprimé avec succès !");
      chargerCommentaires();
    } else {
      alert("Erreur: " + resultat.error);
    }
  }

  function reinitialiserFormulaire() {
    setFormulaire({
      contenu: "",
      note: 0,
    });
    setModeEdition(false);
    setCommentaireEdite(null);
  }

  if (chargement) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-400 mt-4">Chargement des commentaires...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {utilisateur && (
        <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                {modeEdition ? "Modifier votre avis" : "Donnez votre avis"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Partagez votre opinion sur ce film
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSoumettreCommentaire}
              className="space-y-6 mt-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-4">
                  Votre note *
                </label>
                <div className="flex items-center gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setFormulaire({ ...formulaire, note: value })
                      }
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          value <= formulaire.note
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600 fill-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                  {formulaire.note > 0 && (
                    <span className="ml-4 text-lg font-semibold text-white">
                      {formulaire.note}/5
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Votre commentaire *
                </label>
                <textarea
                  name="contenu"
                  value={formulaire.contenu}
                  onChange={handleChange}
                  required
                  minLength="3"
                  maxLength="1000"
                  rows="5"
                  placeholder="Partagez votre avis sur ce film..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all outline-none resize-none"
                />
                <p className="text-sm text-gray-400 mt-2">
                  {formulaire.contenu.length}/1000 caractères
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                {modeEdition && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reinitialiserFormulaire();
                      setIsCommentModalOpen(false);
                    }}
                    className="border-gray-500 text-white bg-transparent"
                  >
                    Annuler
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {modeEdition ? "Modifier" : "Publier"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl  p-6 sm:p-8">
        <div className="mb-8 pb-4 border-b border-gray-700/50">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Avis des spectateurs
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {commentaires.length} {commentaires.length === 1 ? "avis" : "avis"}
          </p>
        </div>

        {commentaires.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-700/50 mb-6">
              <MessageCircle className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-300 text-lg font-medium mb-2">
              Aucun avis pour le moment
            </p>
            <p className="text-gray-500 text-sm">
              Soyez le premier à partager votre opinion !
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {commentaires.map((commentaire) => (
              <div
                key={commentaire._id}
                className="group relative bg-gray-900/40 border border-gray-700/30 rounded-xl p-5 sm:p-6 hover:bg-gray-900/60 hover:border-gray-700/50 transition-all duration-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-11 h-11 sm:w-12 sm:h-12 ring-2 ring-gray-700/50">
                    <AvatarFallback className="bg-gray-700 text-white font-semibold text-sm">
                      {commentaire.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-base truncate">
                          {commentaire.userName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(commentaire.createdAt).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <Star
                              key={value}
                              className={`w-4 h-4 ${
                                value <= commentaire.note
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600 fill-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-yellow-400 ml-1">
                          {commentaire.note}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-200 leading-relaxed text-sm sm:text-base mb-4 pl-0 sm:pl-16">
                  {commentaire.contenu}
                </p>

                {commentaire.userId === utilisateur?.id && (
                  <div className="flex items-center gap-2 pl-0 sm:pl-16 pt-2 border-t border-gray-700/30">
                    <button
                      onClick={() => preparerEdition(commentaire)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Modifier
                    </button>
                    <button
                      onClick={() =>
                        handleSupprimerCommentaire(commentaire._id)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
