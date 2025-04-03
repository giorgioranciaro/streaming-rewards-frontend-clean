import { useEffect, useState } from "react";

export default function Dashboard() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const fetchRewards = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setRewards(data);
      } catch (err) {
        console.error("Errore nel recupero delle rewards:", err);
      }
    };

    fetchRewards();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎧 Streaming Rewards Dashboard</h1>

      {rewards.length === 0 ? (
        <p>Nessuna reward disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{reward.description}</h2>
              <p>Tipo: {reward.type}</p>
              <p>Streams richiesti: {reward.requiredStreams}</p>
              <p>Attiva: {reward.isActive ? "✅" : "❌"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
