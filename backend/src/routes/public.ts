import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { BlogPost } from "../models/BlogPost.js";
import { Project } from "../models/Project.js";
import { SkillGroup } from "../models/SkillGroup.js";
import { ExperienceEntry } from "../models/ExperienceEntry.js";
import { Profile } from "../models/Profile.js";
import { SiteSettings } from "../models/SiteSettings.js";
import { ContactMessage } from "../models/ContactMessage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

router.get("/blog", async (_req, res) => {
  const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 }).lean();
  res.json(posts);
});

router.get("/blog/:slug", async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, published: true }).lean();
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

router.get("/projects", async (_req, res) => {
  const projects = await Project.find().sort({ order: 1 }).lean();
  res.json(projects);
});

router.get("/skills", async (_req, res) => {
  const skills = await SkillGroup.find().sort({ order: 1 }).lean();
  res.json(skills);
});

router.get("/experience", async (_req, res) => {
  const experience = await ExperienceEntry.find().sort({ order: 1 }).lean();
  res.json(experience);
});

router.get("/profile", async (_req, res) => {
  const profile = await Profile.findOne().lean();
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(profile);
});

router.get("/settings", async (_req, res) => {
  const settings = await SiteSettings.findOne().lean();
  if (!settings) {
    res.status(404).json({ error: "Settings not found" });
    return;
  }
  res.json(settings);
});

const contactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(2000),
});

router.post("/contact", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const message = await ContactMessage.create(parsed.data);
  res.status(201).json({ id: message._id, message: "Message sent successfully" });
});

router.get("/resume", (_req, res) => {
  const resumePath = path.join(__dirname, "../../uploads/resume.pdf");
  res.sendFile(resumePath, (err) => {
    if (err) res.status(404).json({ error: "Resume not found" });
  });
});

export default router;
