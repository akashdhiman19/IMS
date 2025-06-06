import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e0e7ff] via-[#f0f4ff] to-[#c7d2fe] flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-10 text-center">
        {/* Logo or Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/70 shadow-2xl rounded-full w-28 h-28 flex items-center justify-center border-4 border-blue-200 animate-pulse">
            <span className="text-5xl">🚌</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-blue-900 drop-shadow-lg tracking-tight animate-fade-in">
          Gobind Coach Bus Image Database
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-8 max-w-2xl animate-fade-in delay-100">
          Browse, organize, and share all Gobind Coach Builder bus images—from any model or purpose, anywhere.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 mb-10">
          <Link href="/gallery" legacyBehavior>
            <a>
              <button className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 hover:from-blue-800 hover:to-blue-900 text-white px-10 py-4 rounded-2xl font-semibold text-xl shadow-xl transition-all duration-200 transform hover:scale-105">
                📁 View Gallery
              </button>
            </a>
          </Link>
          <Link href="/upload" legacyBehavior>
            <a>
              <button className="bg-gradient-to-r from-green-600 via-green-400 to-green-600 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 rounded-2xl font-semibold text-xl shadow-xl transition-all duration-200 transform hover:scale-105">
                ⬆️ Upload Images
              </button>
            </a>
          </Link>
        </div>
      </div>

      {/* Info Section (Glassmorphism) */}
      <div className="container mx-auto px-4 pb-16 animate-fade-in delay-200">
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-10 max-w-3xl mx-auto border border-blue-100">
          <h2 className="text-2xl font-bold mb-3 text-blue-800">How It Works</h2>
          <ul className="list-disc pl-6 text-gray-700 text-lg mb-6 space-y-1">
            <li>
              <span className="font-semibold text-blue-700">Explore:</span> Filter by <span className="font-semibold">Category</span>, <span className="font-semibold">Model</span>, and <span className="font-semibold">Bus Serial</span>.
            </li>
            <li>
              <span className="font-semibold text-green-700">Upload:</span> Add single images or ZIPs, organized instantly by bus type and serial.
            </li>
            <li>
              <span className="font-semibold text-pink-700">Share:</span> Instantly send images or folders to clients on WhatsApp with one click.
            </li>
          </ul>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-4 bg-blue-50 rounded-xl shadow-inner text-blue-700">
              <span className="font-semibold">Ideal for:</span> Marketing, client communication, project coordination, and archiving.
            </div>
            <div className="flex-1 p-4 bg-green-50 rounded-xl shadow-inner text-green-700">
              <span className="font-semibold">File Types:</span> JPG, PNG, ZIP
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-gray-400 py-6 mt-4 border-t border-blue-100 bg-white/60">
        <span className="text-sm">
          &copy; {new Date().getFullYear()} <span className="font-bold text-blue-600">Akash Dhiman</span> • All rights reserved.
        </span>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: none;}
        }
        .animate-fade-in { animation: fade-in 1s both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}
