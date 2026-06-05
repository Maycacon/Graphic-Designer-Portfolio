import { useState } from "react";
import { supabase } from "./supabase";

export type ProjectType = "videos" | "leds" | "flyers";

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  video_url?: string;
  image_url: string;
  type: ProjectType;
  created_at?: string;
  updated_at?: string;
  user_id: string;
};

export function useSupabaseProjects() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = async (type?: ProjectType) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from("projects").select("*");

      if (type) {
        query = query.eq("type", type);
      }

      const { data, error: fetchError } = await query.order("created_at", {
        ascending: false,
      });

      if (fetchError) throw fetchError;
      return data as Project[];
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (project: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await supabase
        .from("projects")
        .insert([project])
        .select()
        .single();

      if (createError) throw createError;
      return data as Project;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;
      return data as Project;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
