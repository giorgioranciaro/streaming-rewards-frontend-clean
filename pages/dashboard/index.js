import { useEffect, useState } from "react";

export default function Dashboard() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    fetch("https://streaming-rewards-backend-production-ad5b.up.railway.app/api/artist/rewards")
      .then(res => res.json())
      .then(data => setRewards(data))
      .catch(err => console.error("Errore nel fetch:", err));
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎧 Dashboard Rewards Artista</h1>

      {rewards.length === 0 ? (
        <p>Nessuna reward disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{reward.type}</h2>
              <p>{reward.description}</p>
              <p><strong>Streams richiesti:</strong> {reward.requiredStreams}</p>
              <p><strong>Stato:</strong> {reward.isActive ? "Attivo" : "Non attivo"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
