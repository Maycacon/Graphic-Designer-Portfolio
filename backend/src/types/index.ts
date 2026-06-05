export type ProjectType = 'videos' | 'leds' | 'flyers';

export interface Project {
  id: string;
  user_id: string;
  type: ProjectType;
  title: string;
  description: string;
  category: string;
  image_url: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectInput {
  type: ProjectType;
  title: string;
  description: string;
  category: string;
  image_url: string;
  video_url?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface UploadResponse {
  url: string;
  public_id: string;
  type: 'image' | 'video';
}
