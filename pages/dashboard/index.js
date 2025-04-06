import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

export default function Dashboard() {
  const [rewards, setRewards] = useState([]);
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token mancante. Effettua il login.");
      return;
    }

    let decoded;
    try {
      decoded = jwt_decode(token);
    } catch (err) {
      console.error("Errore nel decoding del token:", err);
      setError("Token non valido");
      return;
    }

    const fetchRewards = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/rewards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Errore nella richiesta delle rewards");
        }

        const data = await res.json();
        setRewards(data);
      } catch (err) {
        console.error("Errore nel fetch delle rewards:", err);
        setError("Errore nel caricamento delle rewards");
      }
    };

    const fetchArtist = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Errore nel fetch dell'artista");
        }

        const data = await res.json();
        setArtist(data);
      } catch (err) {
        console.error("Errore nel fetch dell'artista:", err);
        setError("Errore nel caricamento dei dati artista");
      }
    };

    fetchRewards();
    fetchArtist();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🎵 Dashboard Artista</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {artist && (
        <div style={{ marginBottom: "2rem" }}>
          <h2>Dati Artista</h2>
          <p><strong>Nome:</strong> {artist.name}</p>
          <p><strong>Email:</strong> {artist.email}</p>
          <p><strong>ID:</strong> {artist.id}</p>
        </div>
      )}

      <h2>Le tue Rewards</h2>
      {rewards.length === 0 ? (
        <p>Nessuna reward disponibile.</p>
      ) : (
        <ul>
          {rewards.map((reward) => (
            <li key={reward.id}>
              <strong>{reward.type}</strong> - {reward.description} 
              ({reward.requiredStreams} streams) - {reward.isActive ? "Attiva" : "Inattiva"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
