import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="p-4">Loading data...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎧 Streaming Rewards Dashboard</h1>

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

// ✅ Recupera i dati profilo dell'artista autenticato
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: req.user.userId },
      select: {
        name: true,
        email: true,
        bio: true,
      },
    });

    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    res.json(artist);
  } catch (error) {
    console.error("Error fetching artist profile:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

