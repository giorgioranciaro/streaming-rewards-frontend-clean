// ✅ Import dei moduli React e Next.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// ✅ Componente principale della dashboard
export default function Dashboard() {
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ useEffect per verificare il token e recuperare i dati artista + rewards
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const resRewards = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const resArtist = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!resRewards.ok || !resArtist.ok) {
          throw new Error("Failed to fetch data");
        }

        const rewardsData = await resRewards.json();
        const artistData = await resArtist.json();
        setRewards(rewardsData);
        setArtist(artistData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // ✅ Funzione per cancellare una reward
  const handleDelete = async (rewardId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards/${rewardId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setRewards(rewards.filter((r) => r.id !== rewardId));
      }
    } catch (err) {
      console.error("Failed to delete reward", err);
    }
  };

  // ✅ Loading state
  if (loading) return <p className="p-4">Caricamento dati...</p>;

  // ✅ Render della dashboard
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* ✅ Titolo della dashboard */}
      <h1 className="text-3xl font-bold mb-6">🎧 Dashboard Artista</h1>

      {/* ✅ Dati artista */}
      {artist && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-2">👤 Info Artista</h2>
          <p><strong>Nome:</strong> {artist.name}</p>
          <p><strong>Email:</strong> {artist.email}</p>
          {artist.bio && <p><strong>Bio:</strong> {artist.bio}</p>}
        </div>
      )}

      {/* ✅ Bottone per aggiungere nuova reward */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => alert("Funzione di aggiunta da implementare")}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          ➕ Aggiungi Reward
        </button>
      </div>

      {/* ✅ Lista rewards o messaggio se vuoto */}
      {rewards.length === 0 ? (
        <p>Nessuna reward disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">🎁 {reward.type}</h2>
              <p className="mb-2">{reward.description}</p>
              <p className="text-sm text-gray-600">Streams richiesti: {reward.requiredStreams}</p>
              <p className="text-sm text-gray-600">Attiva: {reward.isActive ? "Sì" : "No"}</p>
              <p className="text-sm text-gray-400 mt-2">
                Creata: {new Date(reward.createdAt).toLocaleDateString()}
              </p>

              {/* ✅ Bottoni modifica e cancella */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => alert("Funzione modifica da implementare")}
                  className="px-4 py-1 bg-blue-600 text-white rounded"
                >
                  ✏️ Modifica
                </button>
                <button
                  onClick={() => handleDelete(reward.id)}
                  className="px-4 py-1 bg-red-600 text-white rounded"
                >
                  🗑 Cancella
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
