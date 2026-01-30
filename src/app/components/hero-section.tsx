import { motion } from "motion/react";
import { AnimatedShapes } from "@/app/components/animated-shapes";

export function HeroSection() {
  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#2d085e' }}>
      {/* Geometric shapes background */}


      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            Design em
            <br />
            <span style={{ color: '#fff6b6' }}>Movimento</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
            Transformo ideias em experiências visuais impactantes através de edição de vídeos e design gráfico
          </p>
          <motion.button
            onClick={scrollToPortfolio}
            className="px-10 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: '#fff6b6', color: '#2d085e' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Portfólio
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;