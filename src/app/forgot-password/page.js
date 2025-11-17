"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      setSent(true);
      toast.success("Un email de réinitialisation a été envoyé.");
    } catch (err) {
      toast.error("Erreur lors de l'envoi. Vérifiez l'email.");
    } finally {
      setLoading(false);
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
                <CardTitle className="text-2xl font-bold text-white text-center">
                  Mot de passe oublié
                </CardTitle>
                <CardDescription className="text-gray-400 text-center">
                  Entrez votre email pour recevoir un lien de réinitialisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sent ? (
                  <p className="text-green-600 text-center">Vérifiez votre boîte mail pour le lien de réinitialisation.</p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus-visible:border-gray-600 focus-visible:ring-gray-600"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        "Envoyer le lien"
                      )}
                    </Button>
                  </form>
                )}
                <div className="mt-6 flex flex-col items-center gap-2 text-sm">
                  <Link
                    href="/login"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Retour à la connexion
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
