import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { FileVideo } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";

import { useSupabaseProjects, Project } from "@/lib/useSupabaseProjects";
import { flyerProjects as fallbackFlyers } from "@/app/lib/fallback-projects";

interface PortfolioFlyersProps {
  onNavigate: (page: string) => void;
}

export function PortfolioFlyers({ onNavigate }: PortfolioFlyersProps) {
  const { fetchProjects } = useSupabaseProjects();
  const [dbProjects, setDbProjects] = useState<Project[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProjects("flyers");
        setDbProjects(data);
      } catch (e) {
        setDbProjects([]);
      }
    };
    load();
  }, []);

  const displayed = dbProjects && dbProjects.length > 0 
    ? dbProjects 
    : fallbackFlyers.map((p: any) => ({ ...p, type: 'flyers' }));
  
  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#2d085e' }}>
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Design de <span style={{ color: '#fde68a' }}>Flyers</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Criação de materiais gráficos impactantes que capturam atenção e comunicam sua mensagem com clareza
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="group relative cursor-pointer"
              >
                <div 
                  className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-300 relative cursor-pointer"
                  onMouseEnter={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if(video) video.play();
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if(video) video.pause();
                  }}
                  onClick={() => {
                    if(project.video_url || project.video) setSelectedProject(project);
                  }}
                >
                  {(project.video_url || project.video) ? (
                    <>
                      <video
                        src={project.video_url || project.video}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        muted
                        loop
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all duration-300 pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-white/90 group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <FileVideo className="w-8 h-8 text-black ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <ImageWithFallback
                      src={project.image_url || project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block" style={{ backgroundColor: '#fde68a', color: '#1f1f1f' }}>
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-white/80">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-6 border-0 rounded-xl" style={{ backgroundColor: '#2d085e' }}>
          {selectedProject && (
            <div className="relative w-full">
              <div className="rounded-lg overflow-hidden border-2" style={{ borderColor: '#fde68a', backgroundColor: '#000' }}>
                <video 
                  src={(selectedProject.video_url || selectedProject.video) as string} 
                  controls 
                  autoPlay 
                  className="w-full h-auto max-h-[65vh] object-contain"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PortfolioFlyers;