// 📦 Import dei React Hooks e router di Next.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  // 🔧 Stato locale per rewards, artista e caricamento
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 useEffect per il recupero dati al caricamento della pagina
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // 🔐 Se non loggato, redirect
      return;
    }

    const fetchData = async () => {
      try {
        // 🎁 Fetch delle rewards
        const resRewards = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // 👤 Fetch delle info artista
        const resArtist = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // 🚨 Controllo degli errori
        if (!resRewards.ok || !resArtist.ok) {
          throw new Error("Failed to fetch data");
        }

        // ✅ Dati ricevuti e salvati nello stato
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

  // 🔄 Loading visuale
  if (loading) {
    return <p className="p-4">Loading data...</p>;
  }

  // 🖼️ UI principale
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎧 Streaming Rewards Dashboard</h1>

      {/* 👤 Sezione info artista */}
      {artist && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-2">👤 Artist Info</h2>
          <p><strong>Name:</strong> {artist.name}</p>
          <p><strong>Email:</strong> {artist.email}</p>
          {artist.bio && <p><strong>Bio:</strong> {artist.bio}</p>}
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
            Modify Info
          </button>
        </div>
      )}

      {/* 🎁 Sezione rewards */}
      {rewards.length === 0 ? (
        <p>No rewards available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">🎁 {reward.type}</h2>
              <p className="mb-2">{reward.description}</p>
              <p className="text-sm text-gray-600">
                Required Streams: {reward.requiredStreams}
              </p>
              <p className="text-sm text-gray-600">
                Active: {reward.isActive ? "Yes" : "No"}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Created: {new Date(reward.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
