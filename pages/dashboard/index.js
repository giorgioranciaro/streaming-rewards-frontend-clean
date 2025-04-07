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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch rewards");
        }

        const data = await res.json();
        setRewards(data.rewards !! data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [router]);

  if (loading) {
    return <p className="p-4">Loading rewards...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎧 Streaming Rewards Dashboard</h1>

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
