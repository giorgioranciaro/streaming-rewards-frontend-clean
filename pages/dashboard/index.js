import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

export default function Dashboard() {
  const [rewards, setRewards] = useState([]);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token mancante nel localStorage");
      return;
    }

    try {
      const decoded = jwt_decode(token);
      setArtist(decoded);
      console.log("Decoded JWT:", decoded);
    } catch (err) {
      console.error("Token decoding failed", err);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRewards(data))
      .catch((err) => console.error("Failed to fetch rewards", err));
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎧 Streaming Rewards Dashboard</h1>

      {artist && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">🎉 Benvenuto, {artist.name || "Artista"}!</h2>
          <p><strong>Email:</strong> {artist.email || "N/A"}</p>
          <p><strong>ID:</strong> {artist.userId || "N/A"}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rewards.length === 0 ? (
          <p className="text-gray-600">Nessuna reward disponibile.</p>
        ) : (
          rewards.map((reward) => (
            <div key={reward.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{reward.type}</h2>
              <p className="text-gray-700">{reward.description}</p>
              <p className="text-sm text-gray-500">
                Streams richiesti: {reward.requiredStreams}
              </p>
              <p className="text-sm text-gray-500">
                Stato: {reward.isActive ? "Attiva" : "Inattiva"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
