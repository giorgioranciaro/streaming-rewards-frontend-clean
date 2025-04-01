import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 🎟️ Token generator
function generateToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

//
// -------------------- FAN --------------------
//
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  const existing = await prisma.fan.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: "Utente già esistente" });
  }

  const hash = await bcrypt.hash(password, 10);
  const fan = await prisma.fan.create({
    data: { name, email, password: hash },
  });

  const token = generateToken(fan.id, "fan");
  res.status(201).json({ token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.fan.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Credenziali non valide" });
  }

  const token = generateToken(user.id, "fan");
  res.json({ token });
});

//
// -------------------- ARTIST --------------------
//
router.post("/artist/register", async (req, res) => {
  const { name, email, password, bio } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  const existing = await prisma.artist.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: "Artista già esistente" });
  }

  const hash = await bcrypt.hash(password, 10);
  const artist = await prisma.artist.create({
    data: { name, email, password: hash, bio },
  });

  const token = generateToken(artist.id, "artist");
  res.status(201).json({ token });
});

router.post("/artist/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.artist.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Credenziali non valide" });
  }

  const token = generateToken(user.id, "artist");
  res.json({ token });
});

//
// -------------------- LABEL --------------------
//
router.post("/label/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  const existing = await prisma.label.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: "Label già esistente" });
  }

  const hash = await bcrypt.hash(password, 10);
  const label = await prisma.label.create({
    data: { name, email, password: hash },
  });

  const token = generateToken(label.id, "label");
  res.status(201).json({ token });
});

router.post("/label/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.label.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Credenziali non valide" });
  }

  const token = generateToken(user.id, "label");
  res.json({ token });
});

export default router;
