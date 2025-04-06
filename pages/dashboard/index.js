git commit -m "Feat: messaggio di benvenuto artista"

import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

export default function Dashboard() {
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchArtist = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Errore nel recupero dati artista");
        const data = await res.json();
        setArtist(data);
      } catch (err) {
        console.error("Errore:", err);
      }
    };

    fetchArtist();
  }, []);

  if (!artist) return <div className="p-4">Caricamento artista...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎧 Benvenuto, {artist.name}</h1>

      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">📇 Profilo</h2>
        <p><strong>ID:</strong> {artist.id}</p>
        <p><strong>Email:</strong> {artist.email}</p>
        <p><strong>Bio:</strong> {artist.bio || "Nessuna biografia"}</p>
        <p><strong>Registrato il:</strong> {new Date(artist.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Aggiungi qui eventualmente una sezione per rewards */}
    </div>
  );
}
