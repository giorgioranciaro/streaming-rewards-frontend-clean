import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchRewards = async () => {
      try {
        const res = await fetch(
          "https://streaming-rewards-backend-production-ad5b.up.railway.app/api/artist/rewards",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎧 Streaming Rewards Dashboard</h1>

      {loading ? (
        <p>Caricamento in corso...</p>
      ) : rewards.length === 0 ? (
        <p>Nessuna reward disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="font-semibold">{reward.type}</p>
              <p>{reward.description}</p>
              <p>🎯 Stream richiesti: {reward.requiredStreams}</p>
              <p className="text-sm text-gray-500">
                Creata il: {new Date(reward.createdAt).toLocaleDateString()}
              </p>
              <p className={`mt-2 text-sm font-medium ${reward.isActive ? "text-green-600" : "text-red-600"}`}>
                {reward.isActive ? "Attiva" : "Non attiva"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
