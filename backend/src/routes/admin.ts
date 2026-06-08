import { Router } from "express";
import { z } from "zod";
import { BlogPost } from "../models/BlogPost.js";
import { Project } from "../models/Project.js";
import { SkillGroup } from "../models/SkillGroup.js";
import { ExperienceEntry } from "../models/ExperienceEntry.js";
import { Profile } from "../models/Profile.js";
import { SiteSettings } from "../models/SiteSettings.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

// Dashboard stats
router.get("/stats", async (_req, res) => {
  const [posts, projects, unreadMessages] = await Promise.all([
    BlogPost.countDocuments(),
    Project.countDocuments(),
    ContactMessage.countDocuments({ read: false }),
  ]);
  res.json({ posts, projects, unreadMessages });
});

// Blog CRUD
const blogSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  excerpt: z.string().min(1),
  tags: z.array(z.string()),
  content: z.string().min(1),
  published: z.boolean().optional(),
});

router.get("/blog", async (_req, res) => {
  const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
  res.json(posts);
});

router.post("/blog", async (req, res) => {
  const parsed = blogSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const post = await BlogPost.create(parsed.data);
  res.status(201).json(post);
});

router.put("/blog/:id", async (req, res) => {
  const parsed = blogSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const post = await BlogPost.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).lean();
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

router.delete("/blog/:id", async (req, res) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json({ message: "Deleted" });
});

// Projects CRUD
const projectSchema = z.object({
  title: z.string().min(1),
  period: z.string().min(1),
  stack: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()),
  github: z.string().optional(),
  order: z.number().optional(),
});

router.get("/projects", async (_req, res) => {
  const projects = await Project.find().sort({ order: 1 }).lean();
  res.json(projects);
});

router.post("/projects", async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const project = await Project.create(parsed.data);
  res.status(201).json(project);
});

router.put("/projects/:id", async (req, res) => {
  const parsed = projectSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const project = await Project.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).lean();
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(project);
});

router.delete("/projects/:id", async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json({ message: "Deleted" });
});

// Skills CRUD
const skillSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  items: z.array(z.string()),
  order: z.number().optional(),
});

router.get("/skills", async (_req, res) => {
  const skills = await SkillGroup.find().sort({ order: 1 }).lean();
  res.json(skills);
});

router.post("/skills", async (req, res) => {
  const parsed = skillSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const skill = await SkillGroup.create(parsed.data);
  res.status(201).json(skill);
});

router.put("/skills/:id", async (req, res) => {
  const parsed = skillSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const skill = await SkillGroup.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).lean();
  if (!skill) {
    res.status(404).json({ error: "Skill group not found" });
    return;
  }
  res.json(skill);
});

router.delete("/skills/:id", async (req, res) => {
  const skill = await SkillGroup.findByIdAndDelete(req.params.id);
  if (!skill) {
    res.status(404).json({ error: "Skill group not found" });
    return;
  }
  res.json({ message: "Deleted" });
});

// Experience CRUD
const experienceSchema = z.object({
  type: z.enum(["internship", "education"]),
  title: z.string().min(1),
  organization: z.string().min(1),
  period: z.string().min(1),
  location: z.string().optional(),
  description: z.string().min(1),
  order: z.number().optional(),
});

router.get("/experience", async (_req, res) => {
  const experience = await ExperienceEntry.find().sort({ order: 1 }).lean();
  res.json(experience);
});

router.post("/experience", async (req, res) => {
  const parsed = experienceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const entry = await ExperienceEntry.create(parsed.data);
  res.status(201).json(entry);
});

router.put("/experience/:id", async (req, res) => {
  const parsed = experienceSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const entry = await ExperienceEntry.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).lean();
  if (!entry) {
    res.status(404).json({ error: "Experience entry not found" });
    return;
  }
  res.json(entry);
});

router.delete("/experience/:id", async (req, res) => {
  const entry = await ExperienceEntry.findByIdAndDelete(req.params.id);
  if (!entry) {
    res.status(404).json({ error: "Experience entry not found" });
    return;
  }
  res.json({ message: "Deleted" });
});

// Profile (singleton)
const profileSchema = z.object({
  name: z.string().min(1),
  roles: z.array(z.string()),
  heroTagline: z.string().min(1),
  heroDescription: z.string().min(1),
  aboutParagraphs: z.array(z.string()),
  stats: z.array(z.object({ label: z.string(), value: z.string(), icon: z.string() })),
  availability: z.string().min(1),
  initials: z.string().optional(),
});

router.get("/profile", async (_req, res) => {
  const profile = await Profile.findOne().lean();
  res.json(profile);
});

router.put("/profile", async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const profile = await Profile.findOneAndUpdate({}, parsed.data, { new: true, upsert: true }).lean();
  res.json(profile);
});

// Settings (singleton)
const settingsSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1),
  github: z.string().min(1),
  linkedin: z.string().optional(),
  resumeUrl: z.string().optional(),
  footerText: z.string().optional(),
});

router.get("/settings", async (_req, res) => {
  const settings = await SiteSettings.findOne().lean();
  res.json(settings);
});

router.put("/settings", async (req, res) => {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const settings = await SiteSettings.findOneAndUpdate({}, parsed.data, { new: true, upsert: true }).lean();
  res.json(settings);
});

// Contact messages
router.get("/messages", async (_req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
  res.json(messages);
});

router.patch("/messages/:id", async (req, res) => {
  const { read } = req.body;
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { read: Boolean(read) },
    { new: true },
  ).lean();
  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.json(message);
});

router.delete("/messages/:id", async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.json({ message: "Deleted" });
});

export default router;
