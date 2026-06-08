import { useState } from "react";
import { supabase } from "./supabase";

const STORAGE_BUCKET = "portfolio-media";

export function useSupabaseStorage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (file: File, folder: "images" | "videos") => {
    if (!file) throw new Error("No file provided");

    setUploading(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const ext = file.name.split(".").pop();
      const fileName = `${timestamp}-${random}.${ext}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // <--- Isso resolve o erro 409 forçando a substituição em caso de conflito
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async (file: File) => {
    return uploadFile(file, "images");
  };

  const uploadVideo = async (file: File) => {
    return uploadFile(file, "videos");
  };

  const deleteFile = async (filePath: string) => {
    setUploading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

      if (deleteError) throw deleteError;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    uploadFile,
    uploadImage,
    uploadVideo,
    deleteFile,
  };
}