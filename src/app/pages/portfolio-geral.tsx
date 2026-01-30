import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { AnimatedShapes } from "@/app/components/animated-shapes";
import { Play, ArrowLeft } from "lucide-react";
import { PortfolioFlyers } from "./portfolio-flyers";
import { PortfolioLeds } from "./portfolio-leds";
import { PortfolioVideos } from "./portfolio-videos";
import { get } from "react-hook-form";

interface PortfolioGeralProps {
  onNavigate: (page: string) => void;
}


export function PortfolioGeral({ onNavigate }: PortfolioGeralProps) {
  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#2d085e' }}>
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: '#2d085e' }}>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Motion <span style={{ color: '#fde68a' }}>Graphics</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Animações sofisticadas que trazem vida às marcas através de movimento, ritmo e storytelling visual
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 px-6 bg-[#2d085e]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="group relative cursor-pointer"
              >
                <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <motion.div
                        className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Play className="w-10 h-10 text-white fill-white ml-1" />
                      </motion.div>
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
    </div>
  );
}

export default PortfolioGeral;
