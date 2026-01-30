import { motion } from "motion/react";
import { Video, FileImage, Sparkles } from "lucide-react";

const services = [
  {
    icon: Video,
    title: "Edição de Vídeos",
    description: "Edição profissional para redes sociais, YouTube e campanhas publicitárias com storytelling impactante."
  },
  {
    icon: FileImage,
    title: "Flyers Digitais",
    description: "Design criativo de flyers e materiais promocionais que capturam atenção e convertem."
  },
  {
    icon: Sparkles,
    title: "Motion Graphics",
    description: "Animações e motion design que trazem vida às suas ideias e engajam seu público."
  }
];

export function ServicesSection() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: 'none' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4" style={{ color: '#ffffff' }}>
            O Que Eu <span style={{ color: '#fff6b6' }}>Faço</span>
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Serviços especializados em design visual e conteúdo audiovisual
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0 } }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                <motion.div
                  className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center"
                  style={{ backgroundColor: '#5b21b6' }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-8 h-8" style={{ color: '#fff6b6' }} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#7c3aed] transition-colors" style={{ color: '#5b21b6' }}>
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
