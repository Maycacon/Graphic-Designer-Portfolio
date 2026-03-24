import { motion } from "motion/react";
import { Instagram, Mail, MessageCircle, MapPin, Phone, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ServicesSection } from "../components/services-section";
import { AnimatedShapes } from "@/app/components/animated-shapes";
import OxyImg from "../assets/img/OxyImage.jpeg";



interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  function handleNavClick(arg0: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#2d085e' }}>
      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-35">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center" />
              <ImageWithFallback
                src={OxyImg}
                alt="Foto de Oxy"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 rounded-2xl shadow-lg hover:shadow-2xl"
                
              />
            </div>
            <motion.div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full"
              style={{ backgroundColor: '#fff6b6' }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Text content */}
          <div>
            <h2 className="text-5xl font-bold mb-6" style={{ color: '#ffffff' }}>
              Sobre <span style={{ color: '#fff6b6' }}>Mim</span>
            </h2>
            <p className="text-lg text-white mb-6 leading-relaxed">
              Sou designer gráfico especializado em criar conteúdo visual que conecta marcas ao seu público. Com experiência em edição de vídeos, motion graphics e design de flyers, transformo conceitos em narrativas visuais envolventes.
            </p>
            <p className="text-lg text-white mb-8 leading-relaxed">
              Meu trabalho combina criatividade, técnica e estratégia para entregar resultados que não apenas impressionam visualmente, mas também geram impacto real para os projetos dos meus clientes.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator'].map((skill) => (

                <motion.button
                  key={skill}
                  className="focus:outline-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <span
                    key={skill}
                    className="px-5 py-2 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: '#fff6b6', color: '#5b21b6' }}
                  >
                    {skill}
                  </span>
                </motion.button>

              ))}
            </div>
          </div>
          <div className="md:col-span-2 mt-16">
            <ServicesSection />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutPage;
