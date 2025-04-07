// ✅ Import necessari
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// ✅ Componente principale della pagina
export default function StreamingLinks() {
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Recupero dei link dal backend all'avvio
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchLinks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/links`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLinks(data);
      } catch (error) {
        console.error("Failed to fetch links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [router]);

  // ✅ Gestione invio nuovo link
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ platform, url }),
      });
      const newLink = await res.json();
      setLinks([...links, newLink]);
      setPlatform("");
      setUrl("");
    } catch (error) {
      console.error("Failed to add link:", error);
    }
  };

  // ✅ Gestione eliminazione di un link
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/artist/links/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinks(links.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  if (loading) return <p className="p-4">Caricamento link...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* ✅ Titolo pagina */}
      <h1 className="text-3xl font-bold mb-6">🔗 Gestione Link Streaming</h1>

      {/* ✅ Lista link */}
      <div className="mb-6">
        {links.length === 0 ? (
          <p>Nessun link disponibile.</p>
        ) : (
          links.map((link) => (
            <div key={link.id} className="bg-white p-4 rounded shadow mb-2 flex justify-between items-center">
              <div>
                <p className="font-semibold">{link.platform}</p>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {link.url}
                </a>
              </div>
              <button
                onClick={() => handleDelete(link.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Elimina
              </button>
            </div>
          ))
        )}
      </div>

      {/* ✅ Form aggiunta nuovo link */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">➕ Aggiungi nuovo link</h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">Piattaforma</label>
          <input
            type="text"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
          Salva Link
        </button>
      </form>

      {/* ✅ Pulsante per tornare alla Dashboard */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
      >
        ← Torna alla Dashboard
      </button>
    </div>
  );
}
