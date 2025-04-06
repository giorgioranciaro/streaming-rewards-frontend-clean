import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode"; // ✅ CORRETTO IMPORT

export default function Dashboard() {
  const [rewards, setRewards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token); // ✅ CORRETTO UTILIZZO
    } catch (err) {
      console.error("Token decoding failed", err);
      router.push("/login");
      return;
    }

    if (decoded.role !== "artist") {
      alert("Accesso riservato agli artisti");
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRewards(data))
      .catch((err) => {
        console.error("Failed to fetch rewards", err);
      });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎧 Streaming Rewards Dashboard</h1>

      {rewards.length === 0 ? (
        <p>Nessuna reward disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{reward.type}</h2>
              <p className="mb-1">{reward.description}</p>
              <p className="text-sm text-gray-600">
                Streams richiesti: {reward.requiredStreams}
              </p>
              <p className="text-sm text-gray-600">
                Stato: {reward.isActive ? "Attiva ✅" : "Inattiva ❌"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
