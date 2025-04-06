import { useState, useEffect } from "react";
// import jwt_decode from "jwt-decode"; (riga commentata)

export default function Dashboard() {
  const [rewards, setRewards] = useState([]);
  const [token, setToken] = useState("");
  const [artistInfo, setArtistInfo] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    requiredStreams: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchRewards(storedToken);
      fetchArtistInfo(storedToken);
    }
  }, []);

  const fetchRewards = async (token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setRewards(data);
    } catch (error) {
      console.error("Errore nel recupero delle rewards:", error);
    }
  };

  const fetchArtistInfo = async (token) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setArtistInfo(data);
    } catch (error) {
      console.error("Errore nel recupero dei dati artista:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          requiredStreams: parseInt(formData.requiredStreams),
        }),
      });

      if (!response.ok) throw new Error("Errore durante la creazione della reward");

      const newReward = await response.json();
      setRewards((prev) => [...prev, newReward]);
      setFormData({ type: "", description: "", requiredStreams: "" });
    } catch (err) {
      console.error("Errore POST reward:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎤 Dashboard Artista</h1>

      {artistInfo && (
        <div style={{ marginBottom: "2rem" }}>
          <p><strong>Nome:</strong> {artistInfo.name}</p>
          <p><strong>Email:</strong> {artistInfo.email}</p>
          <p><strong>ID:</strong> {artistInfo.id}</p>
        </div>
      )}

      <h2>🎁 Rewards Disponibili</h2>
      {rewards.length > 0 ? (
        <ul>
          {rewards.map((reward) => (
            <li key={reward.id}>
              <strong>{reward.type}</strong> – {reward.description} ({reward.requiredStreams} streams)
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessuna reward disponibile.</p>
      )}

      <h3 style={{ marginTop: "2rem" }}>➕ Crea nuova Reward</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input
          type="text"
          name="type"
          placeholder="Tipo (es. merch)"
          value={formData.type}
          onChange={handleInputChange}
          required
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <textarea
          name="description"
          placeholder="Descrizione"
          value={formData.description}
          onChange={handleInputChange}
          required
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <input
          type="number"
          name="requiredStreams"
          placeholder="Stream richiesti"
          value={formData.requiredStreams}
          onChange={handleInputChange}
          required
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <button type="submit">Crea Reward</button>
      </form>

      <button onClick={handleLogout} style={{ marginTop: "2rem", color: "red" }}>
        Esci
      </button>
    </div>
  );
}
