import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Decodifica del token per ottenere il ruolo
    try {
      const decoded = jwt_decode(token);
      setRole(decoded.role);
    } catch (err) {
      console.error("Token decoding failed", err);
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    // Fetch delle rewards
    const fetchRewards = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Errore dal server: ${res.status}`);
        }

        const data = await res.json();
        setRewards(data.rewards || data); // Gestione formato risposta
      } catch (err) {
        console.error("Errore nel fetch delle rewards:", err);
      }
    };

    fetchRewards();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎧 Streaming Rewards Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="mb-4 text-gray-600">👤 Ruolo: {role}</p>

      <h2 className="text-xl font-semibold mb-4">🎁 Rewards disponibili:</h2>

      {rewards.length === 0 ? (
        <p className="text-gray-500">Nessuna reward disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-2">{reward.description}</h3>
              <p>🎯 Streams richiesti: {reward.requiredStreams}</p>
              <p>🎁 Tipo: {reward.type}</p>
              <p>🟢 {reward.isActive ? "Attiva" : "Non attiva"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
