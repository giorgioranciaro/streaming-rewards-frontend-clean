import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("artist"); // default
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const endpointMap = {
      artist: "/api/auth/artist/login",
      fan: "/api/auth/login",
      label: "/api/auth/label/login",
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpointMap[role]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login fallito");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);

      // Redirige alla dashboard specifica (in futuro potremo separarle meglio)
      router.push("/dashboard");
    
} catch {
  setError("Credenziali non valide");
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin}>
          <select
            className="w-full border p-2 mb-4 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="artist">Artista</option>
            <option value="fan">Fan</option>
            <option value="label">Label</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800">
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}
