import express from "express";
import { PrismaClient } from "@prisma/client";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Recupera tutte le rewards dell'artista autenticato
router.get("/rewards", authenticateToken, async (req, res) => {
  try {
    const rewards = await prisma.reward.findMany({
      where: {
        artistId: req.user.userId,
      },
    });

    res.json(rewards);
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Recupera i dati profilo dell'artista autenticato
// ✅ Get artist profile
router.get("/profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const artist = await prisma.artist.findUnique({
      where: { id: decoded.userId },
      select: { name: true, email: true, bio: true } // Escludiamo id e password
    });

    if (!artist) return res.status(404).json({ error: "Artist not found" });

    res.json(artist);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
