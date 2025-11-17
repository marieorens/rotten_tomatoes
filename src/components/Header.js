"use client";
import { useState, useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchUser } from "@/utils/fetchUser";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUser();
        if (userData) {
          setIsLoggedIn(true);
          setUser(userData);
        } else {
          setIsLoggedIn(true);
          setUser({
            username: firebaseUser.displayName,
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL,
            provider: "google",
          });
        }
      } else {
        const userData = await fetchUser();
        if (userData) {
          setIsLoggedIn(true);
          setUser(userData);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      await signOut(auth);
    } catch (e) {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    setIsLoggedIn(false);
    setUser(null);
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 via-black/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-4 cursor-pointer"
          >
            <Image
              src="/logo.png"
              alt="Movie App"
              width={40}
              height={40}
              className="sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px]"
            />
            <Image
              src="/movies.png"
              alt="Movie App"
              width={85}
              height={85}
              className="hidden sm:block"
            />
          </Link>

          <nav className="hidden md:flex gap-6 lg:gap-8">
            <Link
              href="/"
              className="text-gray-300 transition-colors hover:text-white text-sm lg:text-base"
            >
              Home
            </Link>
            <a
              href="#"
              className="text-gray-300 transition-colors hover:text-white text-sm lg:text-base"
            >
              Explore
            </a>
            <a
              href="#"
              className="text-gray-300 transition-colors hover:text-white text-sm lg:text-base"
            >
              Genre
            </a>
            <a
              href="#"
              className="text-gray-300 transition-colors hover:text-white text-sm lg:text-base"
            >
              Movies
            </a>
            <a
              href="#"
              className="text-gray-300 transition-colors hover:text-white text-sm lg:text-base"
            >
              TV Shows
            </a>
            {isLoggedIn && (
              <>
                <Link
                  href="/favoris"
                  className="text-gray-300 transition-colors hover:text-white text-sm lg:text-base"
                >
                  Mes films favoris
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/admin/films"
                    className="text-gray-300 transition-colors hover:text-white text-sm lg:text-base"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-gray-300 transition-colors hover:text-white text-sm lg:text-base flex items-center gap-2"
                >
                  <Avatar className="w-6 h-6 border-2 border-gray-300 hover:border-white transition-colors">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full" />
                    ) : (
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {user?.username || "Profil"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 transition-colors hover:text-white text-sm lg:text-base"
                >
                  Se déconnecter
                </button>
              </>
            )}
            {!isLoggedIn && (
              <button
                onClick={handleLogin}
                className="text-gray-300 transition-colors hover:text-white text-sm lg:text-base"
              >
                Se connecter
              </button>
            )}
          </nav>

          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col gap-1.5 p-2 text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-4 py-4 border-t border-white/20">
            <Link
              href="/"
              onClick={closeMenu}
              className="text-gray-300 transition-colors hover:text-white py-2"
            >
              Home
            </Link>
            <a
              href="#"
              onClick={closeMenu}
              className="text-gray-300 transition-colors hover:text-white py-2"
            >
              Explore
            </a>
            <a
              href="#"
              onClick={closeMenu}
              className="text-gray-300 transition-colors hover:text-white py-2"
            >
              Genre
            </a>
            <a
              href="#"
              onClick={closeMenu}
              className="text-gray-300 transition-colors hover:text-white py-2"
            >
              Movies
            </a>
            <a
              href="#"
              onClick={closeMenu}
              className="text-gray-300 transition-colors hover:text-white py-2"
            >
              TV Shows
            </a>
            {isLoggedIn && (
              <>
                <Link
                  href="/favoris"
                  onClick={closeMenu}
                  className="text-gray-300 transition-colors hover:text-white py-2"
                >
                  Mes films favoris
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/admin/films"
                    onClick={closeMenu}
                    className="text-gray-300 transition-colors hover:text-white py-2"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="text-gray-300 transition-colors hover:text-white py-2 flex items-center gap-2"
                >
                  <Avatar className="w-6 h-6 border-2 border-gray-300">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  Profil
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="text-gray-300 transition-colors hover:text-white py-2 w-full text-left"
                >
                  Se déconnecter
                </button>
              </>
            )}
            {!isLoggedIn && (
              <button
                onClick={() => {
                  closeMenu();
                  handleLogin();
                }}
                className="text-gray-300 transition-colors hover:text-white py-2 w-full text-left"
              >
                Se connecter
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
