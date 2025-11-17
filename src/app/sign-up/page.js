"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/auth/signup", { username, email, password });
      toast.success("Inscription réussie !");
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'inscription");
    }
    setIsLoading(false);
  };

  const handleGoogle = async () => {
    try {
      const { auth, googleProvider } = await import("@/firebase/firebase");
      const { signInWithPopup } = await import("firebase/auth");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await axios.post("/api/auth/firebase-sync", {
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL,
        provider: "google",
      });
      toast.success("Connecté avec Google !");
      router.push("/");
    } catch (err) {
      toast.error("Erreur Google : " + (err?.message || err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="relative">
        <Header />
      </div>

      <main className="relative pt-20">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-white text-center">Inscription</CardTitle>
                <CardDescription className="text-gray-400 text-center">
                  Créez votre compte dès maintenant pour accéder à toutes les fonctionnalités
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Entrez votre nom d'utilisateur"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Entrez votre email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription en cours...
                      </>
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                </form>

                <button
                  type="button"
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold rounded-md py-2 shadow hover:bg-gray-100 mt-6"
                >
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <g>
                      <path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.9-6.9C35.64 2.36 30.13 0 24 0 14.61 0 6.36 5.64 2.44 14.02l8.06 6.27C12.6 13.13 17.87 9.5 24 9.5z"/>
                      <path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.5c-.54 2.9-2.16 5.36-4.6 7.04l7.1 5.52C43.64 37.36 46.1 31.44 46.1 24.5z"/>
                      <path fill="#FBBC05" d="M10.5 28.79c-1.13-3.36-1.13-6.97 0-10.33l-8.06-6.27C.16 16.36 0 20.09 0 24c0 3.91.16 7.64 2.44 11.02l8.06-6.23z"/>
                      <path fill="#EA4335" d="M24 46c6.13 0 11.64-2.36 15.84-6.48l-7.1-5.52c-2.01 1.35-4.59 2.15-7.74 2.15-6.13 0-11.4-3.63-13.5-8.79l-8.06 6.23C6.36 42.36 14.61 48 24 48z"/>
                    </g>
                  </svg>
                  S'inscrire avec Google
                </button>

                <div className="mt-6 flex flex-col items-center gap-4">
                  <p className="text-gray-400 text-sm">
                    Vous avez déjà un compte?{" "}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Connectez-vous
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
