"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import MovieGrid from "@/components/MovieGrid";
import { Bookmark } from "lucide-react";

export default function FavorisPage() {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, loading: authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    } else if (isLoggedIn) {
      loadFavoris();
    }
  }, [isLoggedIn, authLoading, router]);

  const loadFavoris = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/favoris");
      if (response.data.success) {
        setFavoris(response.data.favoris);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-400">
                Patientez pour le chargement de vos films favoris...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Mes favoris
            </h1>
          </div>
          <p className="text-gray-400">
            {favoris.length}{" "}
            {favoris.length === 1 ? "film sauvegardé" : "films sauvegardés"}
          </p>
        </div>

        {favoris.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-700/50 mb-6">
              <Bookmark className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-300 text-lg font-medium mb-2">
              Aucun film en favoris
            </p>
            <p className="text-gray-500 text-sm">
              Commencez à ajouter des films à vos favoris !
            </p>
          </div>
        ) : (
          <MovieGrid
            movies={{
              results: favoris,
              total_results: favoris.length,
              page: 1,
              total_pages: 1,
            }}
            title=""
          />
        )}
      </main>
    </div>
  );
}
