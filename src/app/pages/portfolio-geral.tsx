import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useSupabaseProjects, Project } from "@/lib/useSupabaseProjects";
import { flyerProjects as fallbackFlyers, ledsProjects as fallbackLeds, videoProjects as fallbackVideos } from "@/app/lib/fallback-projects";
import { ProjectCard } from "@/app/components/ProjectCard";
import { VideoModal } from "@/app/components/VideoModal";

interface PortfolioGeralProps {
  onNavigate: (page: string) => void;
}

export function PortfolioGeral({ onNavigate }: PortfolioGeralProps) {
  const { fetchProjects } = useSupabaseProjects();
  const [dbProjects, setDbProjects] = useState<Project[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProjects(); // Busca todos os projetos do DB
        setDbProjects(data);
      } catch (e) {
        console.error("Erro ao carregar projetos do Supabase:", e);
        setDbProjects([]);
      }
    };
    load();
  }, []);

  // Adicionada tipagem explícita (p: Project) e (p: any) para resolver o erro TS2698
  const all = dbProjects && dbProjects.length > 0 
    ? dbProjects.map((p: Project) => ({ ...p, video: p.video_url, image: p.image_url })) 
    : [
        ...fallbackFlyers.map((p: any) => ({ ...p, type: 'flyers' })),
        ...fallbackLeds.map((p: any) => ({ ...p, type: 'leds' })),
        ...fallbackVideos.map((p: any) => ({ ...p, type: 'videos' }))
      ];

  const sections = [
    { type: "flyers", title: "Flyers", route: "portfolio-flyers" },
    { type: "leds", title: "LEDs", route: "portfolio-leds" },
    { type: "videos", title: "Vídeos", route: "portfolio-videos" },
  ];

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#2d085e' }}>
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto space-y-24">
          {sections.map((section) => (
            <div key={section.type}>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white">{section.title}</h2>
                <motion.button
                  onClick={() => onNavigate(section.route)}
                  className="px-8 py-4 bg-[#fde68a] text-[#2d085e] rounded-full font-semibold hover:bg-[#fde68a]/80 transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Todos
                </motion.button>
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {all
                  .filter((p) => p.type === section.type)
                  .map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      onClick={setSelectedProject}
                      aspectRatio="video"
                      variant="bottom"
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <VideoModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

export default PortfolioGeral;