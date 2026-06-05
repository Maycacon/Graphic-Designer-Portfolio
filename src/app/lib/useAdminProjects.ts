import { useEffect, useState } from "react";
import { videoProjects as fallbackVideos, flyerProjects as fallbackFlyers, ledsProjects as fallbackLeds } from "./fallback-projects";
import { normalizeCategory } from "./category-utils";
import { loadLocalProjects } from "./local-projects";
import { supabase } from "@/lib/supabase";

export type ProjectItem = {
  id: number;
  title?: string;
  category?: string;
  description?: string;
  image?: string;
  video?: string;
};

export function useAdminProjects() {
  const [projects, setProjects] = useState<ProjectItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchProjects() {
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from("projects")
          .select("*");

        if (fetchError) throw fetchError;

        if (mounted) {
          const mapped = Array.isArray(data)
            ? data.map((p: any) => ({
                ...p,
                category: normalizeCategory(p.category),
              }))
            : [];
          const local = loadLocalProjects();
          const merged = [
            ...mapped,
            ...local.filter((lp: any) => !mapped.some((m: any) => m.id === lp.id)),
          ];
          setProjects(merged);
        }
      } catch (err) {
        // fallback to local arrays (also normalize categories) and merge local saved ones
        if (mounted) {
          const base = [
            ...fallbackVideos.map((p: any) => ({
              ...p,
              category: normalizeCategory(p.category),
            })),
            ...fallbackFlyers.map((p: any) => ({
              ...p,
              category: normalizeCategory(p.category),
            })),
            ...fallbackLeds.map((p: any) => ({
              ...p,
              category: normalizeCategory(p.category),
            })),
          ];
          const local = loadLocalProjects();
          const merged = [
            ...base,
            ...local.filter((lp: any) => !base.some((b: any) => b.id === lp.id)),
          ];
          setProjects(merged);
        }
        setError((err as Error)?.message || "failed");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchProjects();
    return () => {
      mounted = false;
    };
  }, []);

  return { projects, loading, error };
}

export default useAdminProjects;
