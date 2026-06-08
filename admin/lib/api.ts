import { getToken, clearToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; role: string } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getStats: () => request<{ posts: number; projects: number; unreadMessages: number }>("/api/admin/stats"),

  getBlogPosts: () => request<BlogPost[]>("/api/admin/blog"),
  createBlogPost: (data: Partial<BlogPost>) =>
    request<BlogPost>("/api/admin/blog", { method: "POST", body: JSON.stringify(data) }),
  updateBlogPost: (id: string, data: Partial<BlogPost>) =>
    request<BlogPost>(`/api/admin/blog/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBlogPost: (id: string) => request(`/api/admin/blog/${id}`, { method: "DELETE" }),

  getProjects: () => request<Project[]>("/api/admin/projects"),
  createProject: (data: Partial<Project>) =>
    request<Project>("/api/admin/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: string, data: Partial<Project>) =>
    request<Project>(`/api/admin/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: string) => request(`/api/admin/projects/${id}`, { method: "DELETE" }),

  getSkills: () => request<SkillGroup[]>("/api/admin/skills"),
  createSkill: (data: Partial<SkillGroup>) =>
    request<SkillGroup>("/api/admin/skills", { method: "POST", body: JSON.stringify(data) }),
  updateSkill: (id: string, data: Partial<SkillGroup>) =>
    request<SkillGroup>(`/api/admin/skills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSkill: (id: string) => request(`/api/admin/skills/${id}`, { method: "DELETE" }),

  getExperience: () => request<ExperienceEntry[]>("/api/admin/experience"),
  createExperience: (data: Partial<ExperienceEntry>) =>
    request<ExperienceEntry>("/api/admin/experience", { method: "POST", body: JSON.stringify(data) }),
  updateExperience: (id: string, data: Partial<ExperienceEntry>) =>
    request<ExperienceEntry>(`/api/admin/experience/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExperience: (id: string) => request(`/api/admin/experience/${id}`, { method: "DELETE" }),

  getProfile: () => request<Profile | null>("/api/admin/profile"),
  updateProfile: (data: Profile) =>
    request<Profile>("/api/admin/profile", { method: "PUT", body: JSON.stringify(data) }),

  getSettings: () => request<SiteSettings | null>("/api/admin/settings"),
  updateSettings: (data: SiteSettings) =>
    request<SiteSettings>("/api/admin/settings", { method: "PUT", body: JSON.stringify(data) }),

  getMessages: () => request<ContactMessage[]>("/api/admin/messages"),
  markMessageRead: (id: string, read: boolean) =>
    request<ContactMessage>(`/api/admin/messages/${id}`, { method: "PATCH", body: JSON.stringify({ read }) }),
  deleteMessage: (id: string) => request(`/api/admin/messages/${id}`, { method: "DELETE" }),
};

export type BlogPost = {
  _id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  published: boolean;
};

export type Project = {
  _id: string;
  title: string;
  period: string;
  stack: string;
  description: string;
  tags: string[];
  github?: string;
  order: number;
};

export type SkillGroup = {
  _id: string;
  icon: string;
  title: string;
  items: string[];
  order: number;
};

export type ExperienceEntry = {
  _id: string;
  type: "internship" | "education";
  title: string;
  organization: string;
  period: string;
  location?: string;
  description: string;
  order: number;
};

export type Profile = {
  _id?: string;
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
  _id?: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  footerText: string;
};

export type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};
