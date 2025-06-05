// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero */}
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-blue-800 drop-shadow-lg">
          Gobind Coach Bus Image Database
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl">
          Browse, organize, and share all Gobind Coach Builder bus images—from any model or purpose, anywhere.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Link href="/gallery">
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-2xl font-semibold text-lg shadow-lg">
              📁 View Gallery
            </button>
          </Link>
          <Link href="/upload">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-semibold text-lg shadow-lg">
              ⬆️ Upload Images
            </button>
          </Link>
        </div>
      </div>

      {/* Info Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-white/70 rounded-3xl shadow-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-blue-800">How It Works</h2>
          <ul className="list-disc pl-6 text-gray-700 text-lg mb-6">
            <li>
              <span className="font-medium text-blue-700">Explore:</span> Filter by <span className="font-semibold">Category</span>, <span className="font-semibold">Model</span>, and <span className="font-semibold">Bus Serial</span>.
            </li>
            <li>
              <span className="font-medium text-blue-700">Upload:</span> Add single images or ZIPs, organized instantly by bus type and serial.
            </li>
            <li>
              <span className="font-medium text-blue-700">Share:</span> Instantly send images or folders to clients on WhatsApp with one click.
            </li>
          </ul>
          <div className="flex flex-col gap-2">
            <div className="p-4 bg-blue-50 rounded-xl">
              <span className="font-semibold">Ideal for:</span> Marketing, client communication, project coordination, and archiving.
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <span className="font-semibold">File Types:</span> JPG, PNG, ZIP
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-gray-400 py-6 mt-8 border-t">
        &copy; {new Date().getFullYear()} Gobind Coach Builder • Powered by Next.js & Sanity
      </footer>
    </div>
  );
}
