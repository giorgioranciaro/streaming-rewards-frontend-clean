import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [token, setToken] = useState("");
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({ type: "", description: "", requiredStreams: "" });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return router.push("/login");

    setToken(storedToken);
    fetchRewards(storedToken);
  }, []);

  const fetchRewards = async (token) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRewards(data);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        type: formData.type,
        description: formData.description,
        requiredStreams: parseInt(formData.requiredStreams),
      }),
    });
    const newReward = await res.json();
    setRewards((prev) => [...prev, newReward]);
    setFormData({ type: "", description: "", requiredStreams: "" });
  };

  const handleDelete = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setRewards((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setFormData({
      type: reward.type,
      description: reward.description,
      requiredStreams: reward.requiredStreams,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards/${editingReward.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        type: formData.type,
        description: formData.description,
        requiredStreams: parseInt(formData.requiredStreams),
      }),
    });
    const updated = await res.json();
    setRewards((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditingReward(null);
    setFormData({ type: "", description: "", requiredStreams: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎧 Dashboard Rewards</h1>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 text-white rounded">
          Logout
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">🎁 Le tue Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded shadow">
            <p><strong>{r.type.toUpperCase()}</strong> – {r.description}</p>
            <p>🎯 Streams richiesti: {r.requiredStreams}</p>
            <div className="mt-2 space-x-2">
              <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEdit(r)}>Modifica</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(r.id)}>Elimina</button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-xl font-semibold">{editingReward ? "✏️ Modifica Reward" : "➕ Crea Reward"}</h2>
      <form onSubmit={editingReward ? handleUpdate : handleCreate} className="mt-4 max-w-md space-y-4">
        <input
          type="text"
          name="type"
          placeholder="Tipo (stream/share)"
          value={formData.type}
          onChange={handleInputChange}
          required
          className="w-full border px-3 py-2"
        />
        <input
          type="text"
          name="description"
          placeholder="Descrizione"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="w-full border px-3 py-2"
        />
        <input
          type="number"
          name="requiredStreams"
          placeholder="Streams richiesti"
          value={formData.requiredStreams}
          onChange={handleInputChange}
          required
          className="w-full border px-3 py-2"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          {editingReward ? "Aggiorna" : "Crea"}
        </button>
      </form>
    </div>
  );
}
