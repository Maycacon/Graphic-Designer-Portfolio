import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useSupabaseProjects, Project } from "@/lib/useSupabaseProjects";
import { videoProjects as fallbackVideos } from "@/app/lib/fallback-projects";
import { ProjectCard } from "@/app/components/ProjectCard";
import { VideoModal } from "@/app/components/VideoModal";

interface PortfolioVideosProps {
  onNavigate: (page: string) => void;
}

export function PortfolioVideos({ onNavigate }: PortfolioVideosProps) {
  const { fetchProjects } = useSupabaseProjects();
  const [dbProjects, setDbProjects] = useState<Project[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProjects("videos"); // Traz apenas os vídeos do DB
        setDbProjects(data);
      } catch (e) {
        setDbProjects([]);
      }
    };
    load();
  }, []);
  
  const displayed = dbProjects && dbProjects.length > 0 
    ? dbProjects.map((p) => ({ ...p, video: p.video_url, image: p.image_url }))
    : fallbackVideos.map((p: any) => ({ ...p, type: 'videos' }));

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#2d085e' }}>
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Edição de <span style={{ color: '#fde68a' }}>Vídeos</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Conteúdo audiovisual que conta histórias e engaja audiências através de storytelling visual impactante
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={setSelectedProject}
                aspectRatio="video"
                variant="center"
              />
            ))}
          </div>
        </div>
      </section>

      <VideoModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

export default PortfolioVideos;