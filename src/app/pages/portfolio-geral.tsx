import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Play, ArrowLeft, FileVideo } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import {flyerProjects} from "./portfolio-flyers";
import {ledsProjects} from "./portfolio-leds";
import {videoProjects} from "./portfolio-videos";


interface PortfolioGeralProps {
  onNavigate: (page: string) => void;
}


export function PortfolioGeral({ onNavigate }: PortfolioGeralProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#2d085e' }}>
      {/* Portfolio Sections */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto space-y-24">
          {/* Flyers Section */}
          <div>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Flyers</h2>
              <motion.button
                onClick={() => onNavigate('portfolio-flyers')}
                className="px-8 py-4 bg-[#fde68a] text-[#2d085e] rounded-full font-semibold hover:bg-[#fde68a]/80 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Todos
              </motion.button>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {flyerProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  whileHover={{ y: -16, scale: 1.03 }}
                  className="group relative cursor-pointer shadow-xl rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:shadow-2xl transition-all duration-300"
                  onClick={() => {
                    if(project.video) setSelectedProject(project);
                  }}
                  onMouseEnter={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if(video) video.play();
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if(video) video.pause();
                  }}
                >
                  <div className="aspect-video w-full h-56 bg-gray-200 dark:bg-gray-800 relative">
                    {project.video ? (
                      <>
                        <video
                          src={project.video}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          muted
                          loop
                          preload="metadata"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all duration-300 pointer-events-none">
                          <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-white/90 group-hover:scale-110 transition-all duration-300 shadow-lg">
                            <FileVideo className="w-6 h-6 text-black ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block" style={{ backgroundColor: '#fde68a', color: '#2d085e' }}>
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-base text-white/90 mb-3">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* LEDs Section */}
          <div>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white">LEDs</h2>
              <motion.button
                onClick={() => onNavigate('portfolio-leds')}
                className="px-8 py-4 bg-[#fde68a] text-[#2d085e] rounded-full font-semibold hover:bg-[#fde68a]/80 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Todos
              </motion.button>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {ledsProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  whileHover={{ y: -16, scale: 1.03 }}
                  className="group relative cursor-pointer shadow-xl rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:shadow-2xl transition-all duration-300"
                  onClick={() => {
                    if(project.video) setSelectedProject(project);
                  }}
                  onMouseEnter={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if(video) video.play();
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if(video) video.pause();
                  }}
                >
                  <div className="aspect-video w-full h-56 bg-gray-200 dark:bg-gray-800 relative">
                    {project.video ? (
                      <>
                        <video
                          src={project.video}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          muted
                          loop
                          preload="metadata"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all duration-300 pointer-events-none">
                          <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-white/90 group-hover:scale-110 transition-all duration-300 shadow-lg">
                            <FileVideo className="w-6 h-6 text-black ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block" style={{ backgroundColor: '#fde68a', color: '#2d085e' }}>
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-base text-white/90 mb-3">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Vídeos Section */}
          <div>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Vídeos</h2>
              <motion.button
                onClick={() => onNavigate('portfolio-videos')}
                className="px-8 py-4 bg-[#fde68a] text-[#2d085e] rounded-full font-semibold hover:bg-[#fde68a]/80 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Todos
              </motion.button>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {videoProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  whileHover={{ y: -16, scale: 1.03 }}
                  className="group relative cursor-pointer shadow-xl rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:shadow-2xl transition-all duration-300"
                  onClick={() => {
                    if(project.video) setSelectedProject(project);
                  }}
                  onMouseEnter={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if(video) video.play();
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if(video) video.pause();
                  }}
                >
                  <div className="aspect-video w-full h-56 bg-gray-200 dark:bg-gray-800 relative">
                    {project.video ? (
                      <>
                        <video
                          src={project.video}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          muted
                          loop
                          preload="metadata"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all duration-300 pointer-events-none">
                          <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-white/90 group-hover:scale-110 transition-all duration-300 shadow-lg">
                            <FileVideo className="w-6 h-6 text-black ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block" style={{ backgroundColor: '#fde68a', color: '#2d085e' }}>
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-base text-white/90 mb-3">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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

export default PortfolioGeral;
