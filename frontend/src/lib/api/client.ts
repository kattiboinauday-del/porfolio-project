const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export type BlogPost = {
  _id?: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  published?: boolean;
};

export type Project = {
  _id?: string;
  title: string;
  period: string;
  stack: string;
  description: string;
  tags: string[];
  github?: string;
  order?: number;
};

export type SkillGroup = {
  _id?: string;
  icon: string;
  title: string;
  items: string[];
  order?: number;
};

export type ExperienceEntry = {
  _id?: string;
  type: "internship" | "education";
  title: string;
  organization: string;
  period: string;
  location?: string;
  description: string;
  order?: number;
};

export type Profile = {
  name: string;
  roles: string[];
  heroTagline: string;
  heroDescription: string;
  aboutParagraphs: string[];
  stats: { label: string; value: string; icon: string }[];
  availability: string;
  initials: string;
};

export type SiteSettings = {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  footerText: string;
};

export const api = {
  getBlogPosts: () => request<BlogPost[]>("/api/blog"),
  getBlogPost: (slug: string) => request<BlogPost>(`/api/blog/${slug}`),
  getProjects: () => request<Project[]>("/api/projects"),
  getSkills: () => request<SkillGroup[]>("/api/skills"),
  getExperience: () => request<ExperienceEntry[]>("/api/experience"),
  getProfile: () => request<Profile>("/api/profile"),
  getSettings: () => request<SiteSettings>("/api/settings"),
  submitContact: (data: { name: string; email: string; subject: string; message: string }) =>
    request<{ message: string }>("/api/contact", { method: "POST", body: JSON.stringify(data) }),
};

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    return await api.getBlogPost(slug);
  } catch {
    return null;
  }
}
