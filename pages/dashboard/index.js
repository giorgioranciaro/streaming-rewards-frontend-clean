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

export default router;
