import "dotenv/config";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { BlogPost } from "../models/BlogPost.js";
import { Project } from "../models/Project.js";
import { SkillGroup } from "../models/SkillGroup.js";
import { ExperienceEntry } from "../models/ExperienceEntry.js";
import { Profile } from "../models/Profile.js";
import { SiteSettings } from "../models/SiteSettings.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const blogPosts = [
  {
    slug: "cartoonification-opencv-streamlit",
    title: "How I Built a Cartoonification App with OpenCV and Streamlit",
    date: "Oct 15, 2025",
    excerpt:
      "A deep-dive into the computer vision techniques powering the cartoonifier — Bilateral Filtering, K-Means Color Quantization, and Adaptive Thresholding — and how I wired them into a snappy Streamlit UI.",
    tags: ["Computer Vision", "OpenCV", "Streamlit", "Python"],
    content: `# How I Built a Cartoonification App with OpenCV and Streamlit

When I started the Cartoonification project, the goal was simple: turn any photo into something that feels hand-drawn. The reality was a lot more interesting.

## The Pipeline

The transform happens in three core stages:

1. **Bilateral Filtering** — smooths color regions while preserving edges, the foundation of any cartoon look.
2. **K-Means Color Quantization** — collapses thousands of colors into a handful of flat, poster-like tones.
3. **Adaptive Thresholding** — extracts crisp, ink-like edges from a grayscale pass.

Multiplying the quantized colors against the edge mask gives the final cartoon frame.

## Beyond the Basics

To make it more than a textbook demo, I added:

- A **step-by-step viewer** so you can see every intermediate frame.
- A **Live Mode** that runs the entire pipeline on a webcam feed in real time.
- A **Filter Gallery** with watercolor and pixel-art variants.
- A **Pencil Animation** mode that simulates the strokes of hand-drawn sketching.

## Lessons Learned

Real-time CV is mostly a battle against latency. The biggest wins came from downscaling intelligently, caching kernels, and keeping Streamlit reruns minimal. Computer vision rewards patience — and a lot of profiling.`,
    published: true,
  },
  {
    slug: "voip-latency-lessons",
    title: "Reducing VoIP Latency: What I Learned Building a Real-Time Communication System",
    date: "Nov 22, 2024",
    excerpt:
      "Notes from building a Python VoIP system from scratch — protocol tuning, buffer strategy, and the small choices that cut call latency by 25%.",
    tags: ["Networking", "VoIP", "Python"],
    content: `# Reducing VoIP Latency

Voice is unforgiving. A 200ms delay turns a conversation into a walkie-talkie exchange. Here's how we trimmed it.

## Architecture

A classic client-server setup in Python: UDP for audio frames, TCP for signalling. The hard part isn't the protocol — it's everything around it.

## Where the Milliseconds Hide

- **Jitter buffer sizing** — too small and you get drops; too large and you get lag.
- **Frame size** — 20ms packets balanced throughput against latency best for us.
- **Serialization** — raw byte streams beat any "convenience" format.

## The 25% Win

The biggest single improvement was switching from blocking socket reads to a non-blocking selector loop. Suddenly the audio thread stopped waiting on the network and started doing work.`,
    published: true,
  },
  {
    slug: "vmamba-agricultural-disease-detection",
    title: "Using VMamba for Agricultural Disease Detection — A State Space Model Approach",
    date: "Jun 18, 2025",
    excerpt:
      "Why state space models like VMamba are a compelling alternative to CNNs for plant disease detection, and what it took to get one running on chili leaves.",
    tags: ["Deep Learning", "AgriTech", "VMamba"],
    content: `# Using VMamba for Agricultural Disease Detection

Most plant-disease classifiers reach for a ResNet or an EfficientNet. We tried something different.

## Why VMamba

State space models scale linearly with sequence length, which makes them surprisingly well-suited to high-resolution leaf imagery where global context matters.

## Dataset and Training

A curated chili leaf dataset with healthy and diseased categories. Augmentations were aggressive — rotations, color jitter, and CutMix — because field photos rarely look like a clean test set.

## Results

The VMamba backbone matched and slightly exceeded our CNN baseline at lower inference cost on long sequences. More importantly, it generalizes better to unseen lighting conditions — a huge deal for anything that has to work in a real field.`,
    published: true,
  },
];

const projects = [
  {
    title: "Cartoonification of Images",
    period: "Sep 2025 – Oct 2025",
    stack: "Python · OpenCV · Streamlit",
    description:
      "Interactive computer vision web app that transforms photos into cartoon-style images using Bilateral Filtering, K-Means Color Quantization, and Adaptive Thresholding. Includes a step-by-step pipeline viewer, Live Mode (real-time webcam), Filter Gallery (Watercolor, Pixel Art), and a Pencil Animation simulating hand-drawn sketching.",
    tags: ["Computer Vision", "OpenCV", "Streamlit", "Python"],
    github: "https://github.com/kattiboinauday-del/cartoonify-project",
    order: 0,
  },
  {
    title: "VoIP Communication System",
    period: "Aug 2024 – Nov 2024",
    stack: "Python · Client-Server · Network Protocols",
    description:
      "Real-time Voice over IP system using client-server architecture for audio transmission over computer networks. Optimized network protocols to reduce latency and improve call quality by 25%.",
    tags: ["Networking", "VoIP", "Client-Server", "Python"],
    order: 1,
  },
  {
    title: "AI Call on Hold",
    period: "Dec 2024 – Mar 2025",
    stack: "Python · AI/ML",
    description:
      "AI-powered call hold system that automates call management workflows. Reduced waiting time by 30% and significantly improved user experience through intelligent automation.",
    tags: ["AI", "Automation", "Call Management", "Python"],
    order: 2,
  },
  {
    title: "Smart Agriculture — VMamba for Disease Detection",
    period: "May 2025 – Jun 2025",
    stack: "Python · VMamba · Deep Learning",
    description:
      "Automated chili leaf disease detection system using VMamba state space architecture. Applies deep learning to agricultural imaging for early crop disease identification, supporting precision farming.",
    tags: ["Deep Learning", "AgriTech", "VMamba", "Computer Vision"],
    order: 3,
  },
];

const skillGroups = [
  { icon: "Brain", title: "Core CS", items: ["DSA (Basics)", "Operating Systems", "DBMS", "Computer Networks"], order: 0 },
  {
    icon: "Cpu",
    title: "AI / ML",
    items: ["Supervised Learning", "Unsupervised Learning", "CNNs", "Image Classification", "Model Evaluation"],
    order: 1,
  },
  { icon: "Code2", title: "Programming", items: ["Python (primary)", "HTML", "CSS"], order: 2 },
  { icon: "Wrench", title: "Tools & Platforms", items: ["Git", "VS Code", "Eclipse", "MS Office"], order: 3 },
  { icon: "Users", title: "Soft Skills", items: ["Communication", "Problem Solving", "Time Management", "Adaptability"], order: 4 },
];

const experienceEntries = [
  {
    type: "internship" as const,
    title: "Android Developer",
    organization: "AICTE",
    period: "July 2024 – September 2024",
    location: "Virtual",
    description:
      "Completed a virtual Android development internship under AICTE, gaining hands-on experience in mobile app development and the Android ecosystem tools.",
    order: 0,
  },
  {
    type: "education" as const,
    title: "B.Tech in Computer Science",
    organization: "Velammal Institute of Technology",
    period: "Expected 2028",
    description:
      "Pursuing a B.Tech in Computer Science with a current CGPA of 8.42 / 10. Focused on AI/ML, computer vision, and systems programming.",
    order: 1,
  },
];

const profile = {
  name: "K. Uday Kiran",
  roles: ["B.Tech CSE Student", "Python Developer", "AI/ML Enthusiast", "Computer Vision Builder"],
  heroTagline: "Passionate about building intelligent systems that bridge the gap between AI and real-world applications.",
  heroDescription:
    "Passionate about building intelligent systems that bridge the gap between AI and real-world applications. Currently pursuing B.Tech CS at Velammal Institute of Technology.",
  aboutParagraphs: [
    "I'm Uday Kiran, a Computer Science undergraduate with a strong foundation in Python, AI/ML, and computer vision. I've worked on real-world projects ranging from cartoonifying images with OpenCV to building VoIP communication systems and AI-powered call management tools.",
    "I completed my Android Developer Virtual Internship at AICTE (Jul–Sep 2024) and love combining technical depth with practical impact.",
  ],
  stats: [
    { label: "CGPA", value: "8.42 / 10", icon: "GraduationCap" },
    { label: "Projects", value: "4+", icon: "Code" },
    { label: "Internship", value: "AICTE Android", icon: "Briefcase" },
    { label: "Graduation", value: "2028", icon: "CalendarDays" },
  ],
  availability: "Available for internships & collaborations",
  initials: "UK",
};

const siteSettings = {
  email: "kattiboinauday@gmail.com",
  phone: "+91 70321 75773",
  github: "https://github.com/kattiboinauday-del",
  linkedin: "",
  resumeUrl: "http://localhost:3001/api/resume",
  footerText: "Built with ♥ by K. Uday Kiran · © 2025",
};

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");

  await connectDB(uri);

  const uploadsDir = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const resumeSrc = path.join(__dirname, "../../../resume (6).pdf");
  const resumeDest = path.join(uploadsDir, "resume.pdf");
  if (fs.existsSync(resumeSrc)) {
    fs.copyFileSync(resumeSrc, resumeDest);
    console.log("Resume copied to uploads/resume.pdf");
  }

  await Promise.all([
    BlogPost.deleteMany({}),
    Project.deleteMany({}),
    SkillGroup.deleteMany({}),
    ExperienceEntry.deleteMany({}),
    Profile.deleteMany({}),
    SiteSettings.deleteMany({}),
  ]);

  await BlogPost.insertMany(blogPosts);
  await Project.insertMany(projects);
  await SkillGroup.insertMany(skillGroups);
  await ExperienceEntry.insertMany(experienceEntries);
  await Profile.create(profile);
  await SiteSettings.create(siteSettings);

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@kudaykiran.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await User.findOneAndUpdate(
    { email: adminEmail.toLowerCase() },
    { email: adminEmail.toLowerCase(), passwordHash, role: "admin" },
    { upsert: true, new: true },
  );

  console.log("Seed complete!");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
