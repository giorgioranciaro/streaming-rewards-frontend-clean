// pages/dashboard/add-reward.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function AddReward() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [requiredStreams, setRequiredStreams] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, description, requiredStreams: parseInt(requiredStreams) }),
      });

      if (!res.ok) throw new Error("Failed to create reward");
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">➕ Crea una Nuova Reward</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-lg">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Tipo Reward</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Es. Merch, Backstage..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Descrizione</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Descrizione della reward"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Stream Richiesti</label>
          <input
            type="number"
            value={requiredStreams}
            onChange={(e) => setRequiredStreams(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Crea Reward
        </button>

        {success && <p className="text-green-600 mt-4">Reward creata con successo! ✅</p>}
        {error && <p className="text-red-600 mt-4">Errore: {error}</p>}
      </form>
    </div>
  );
}
