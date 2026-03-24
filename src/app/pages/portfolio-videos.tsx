import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { AnimatedShapes } from "@/app/components/animated-shapes";
import { Play, ArrowLeft, FileVideo } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";

import { useAdminProjects } from "@/app/lib/useAdminProjects";
import { videoProjects as fallbackVideos } from "@/app/lib/fallback-projects";

interface PortfolioVideosProps {
  onNavigate: (page: string) => void;
}

export function PortfolioVideos({ onNavigate }: PortfolioVideosProps) {
  const { projects, loading } = useAdminProjects();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const displayed = projects
    ? projects.filter((p: any) => p.category === 'Vídeos')
    : fallbackVideos.map((p: any) => ({ ...p, category: 'Vídeos' }));
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
              Edição de <span style={{ color: '#fde68a' }}>Vídeos</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Conteúdo audiovisual que conta histórias e engaja audiências através de storytelling visual impactante
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
                  className="aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-300 relative"
                  onMouseEnter={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if(video) video.play();
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if(video) video.pause();
                  }}
                  onClick={() => {
                    if(project.video) setSelectedProject(project);
                  }}
                >
                  {project.video ? (
                    <>
                      <video
                        src={project.video}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        muted
                        loop
                        preload="metadata"
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all duration-300 pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-white/90 group-hover:scale-110 transition-all duration-300 shadow-lg">
                          <FileVideo className="w-8 h-8 text-black ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full mb-2" style={{ backgroundColor: '#fde68a', color: '#1f1f1f' }}>
                        {project.category}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-1">
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
              {/* Vídeo */}
              <div 
                className="rounded-lg overflow-hidden border-2"
                style={{ borderColor: '#fde68a', backgroundColor: '#000' }}
              >
                <video 
                  src={selectedProject.video as string} 
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

export default PortfolioVideos;
