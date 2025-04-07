import { useEffect, useState } from "react";
import { useRouter } from "next/router";


export default function Dashboard() {
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchRewards = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch rewards");
        }

        const data = await res.json();
        setRewards(data);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [router]);

  if (loading) {
    return <div className="p-8">⏳ Caricamento...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎧 Streaming Rewards Dashboard</h1>

      {rewards.length === 0 ? (
        <p>Nessuna reward disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white p-6 rounded-lg shadow">
              <p><strong>Tipo:</strong> {reward.type}</p>
              <p><strong>Descrizione:</strong> {reward.description}</p>
              <p><strong>Streams richiesti:</strong> {reward.requiredStreams}</p>
              <p><strong>Attiva:</strong> {reward.isActive ? "✅" : "❌"}</p>
              <p><strong>Data creazione:</strong> {new Date(reward.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
