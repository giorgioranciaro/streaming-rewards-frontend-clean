import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [artist, setArtist] = useState(null);
  const [token, setToken] = useState("");
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({ type: "", description: "", requiredStreams: "" });
  const [artistForm, setArtistForm] = useState({ name: "", email: "", bio: "" });
  const [editingArtist, setEditingArtist] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return router.push("/login");
    setToken(storedToken);
    fetchRewards(storedToken);
    fetchArtist(storedToken);
  }, []);

  const fetchRewards = async (token) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRewards(data);
  };

  const fetchArtist = async (token) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setArtist(data);
    setArtistForm({ name: data.name, email: data.email, bio: data.bio || "" });
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleArtistInputChange = (e) => {
    setArtistForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleArtistUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(artistForm),
    });
    const updated = await res.json();
    setArtist(updated);
    setEditingArtist(false);
    alert("Dati aggiornati con successo!");
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

      {artist && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">👤 Info Artista</h2>
          // <p><strong>ID:</strong> {artist.id}</p>
          {!editingArtist ? (
            <div className="space-y-2">
              <p><strong>Nome:</strong> {artist.name}</p>
              <p><strong>Email:</strong> {artist.email}</p>
              <p><strong>Bio:</strong> {artist.bio}</p>
              <button onClick={() => setEditingArtist(true)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
                Modifica dati artista
              </button>
            </div>
          ) : (
            <form onSubmit={handleArtistUpdate} className="space-y-4 mt-4">
              <input
                type="text"
                name="name"
                value={artistForm.name}
                onChange={handleArtistInputChange}
                className="w-full border px-3 py-2"
                placeholder="Nome"
                required
              />
              <input
                type="email"
                name="email"
                value={artistForm.email}
                onChange={handleArtistInputChange}
                className="w-full border px-3 py-2"
                placeholder="Email"
                required
              />
              <textarea
                name="bio"
                value={artistForm.bio}
                onChange={handleArtistInputChange}
                className="w-full border px-3 py-2"
                placeholder="Biografia"
                rows={3}
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded">Salva modifiche</button>
            </form>
          )}
        </div>
      )}

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
