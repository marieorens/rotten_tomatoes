import Link from 'next/link';
import Header from '../../../components/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">Film non trouvé</h2>
          <p className="text-gray-400 mb-8">
            Le film que vous recherchez n&apos;existe pas ou a été supprimé.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
