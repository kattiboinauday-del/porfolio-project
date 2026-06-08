import { useQuery } from "@tanstack/react-query";
import { api } from "./client";

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog"],
    queryFn: api.getBlogPosts,
    staleTime: 60_000,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: () => api.getBlogPost(slug),
    staleTime: 60_000,
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: api.getProjects,
    staleTime: 60_000,
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: api.getSkills,
    staleTime: 60_000,
  });
}

export function useExperience() {
  return useQuery({
    queryKey: ["experience"],
    queryFn: api.getExperience,
    staleTime: 60_000,
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: api.getProfile,
    staleTime: 60_000,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: api.getSettings,
    staleTime: 60_000,
  });
}
