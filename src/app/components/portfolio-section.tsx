import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Play } from "lucide-react";

const portfolioItems = [
  {
    id: 1,
    type: 'video',
    title: 'Motion Reel 2025',
    category: 'Motion Graphics',
    image: 'https://images.unsplash.com/photo-1758553173287-513ad13280b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjBjcmVhdGl2ZSUyMG1vZGVybnxlbnwxfHx8fDE3Njk1NTI4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 2,
    type: 'flyer',
    title: 'Campanha Digital',
    category: 'Flyer Design',
    image: 'https://images.unsplash.com/photo-1710799885122-428e63eff691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbHllciUyMGRlc2lnbiUyMG1vY2t1cCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3Njk1NTI4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 3,
    type: 'video',
    title: 'Brand Animation',
    category: 'Motion Graphics',
    image: 'https://images.unsplash.com/photo-1764437180200-f0fd57fa15d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3Rpb24lMjBncmFwaGljcyUyMGFic3RyYWN0JTIwZ2VvbWV0cmljfGVufDF8fHx8MTc2OTU1Mjg3N3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 4,
    type: 'flyer',
    title: 'Evento Musical',
    category: 'Flyer Design',
    image: 'https://images.unsplash.com/photo-1726556267498-2f7cbbc94bf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRmb2xpbyUyMG1vZGVybiUyMGRlc2lnbnxlbnwxfHx8fDE3Njk1NTI4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4" style={{ color: '#1f1f1f' }}>
            Meu <span style={{ color: '#7c3aed' }}>Portfólio</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Seleção de projetos recentes em vídeo e design gráfico
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group relative cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block" style={{ backgroundColor: '#fde68a', color: '#1f1f1f' }}>
                      {item.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                  </div>
                  
                  {item.type === 'video' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Play className="w-10 h-10 text-white fill-white ml-1" />
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PortfolioSection;