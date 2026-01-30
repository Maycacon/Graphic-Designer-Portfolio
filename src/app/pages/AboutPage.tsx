import { motion } from "motion/react";
import { Instagram, Mail, MessageCircle, MapPin, Phone, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ServicesSection } from "../components/services-section";
import { AnimatedShapes } from "@/app/components/animated-shapes";



interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
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
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)' }} />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1639506523061-7359453854f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduZXIlMjB3b3Jrc3BhY2UlMjBwdXJwbGV8ZW58MXx8fHwxNzY5NTUyODc2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Designer workspace"
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
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
              {['Adobe Premiere', 'After Effects', 'Photoshop', 'Illustrator'].map((skill) => (

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

export default ContactPage;
