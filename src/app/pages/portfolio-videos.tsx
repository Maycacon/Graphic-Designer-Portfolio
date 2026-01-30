import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { AnimatedShapes } from "@/app/components/animated-shapes";
import { Play, ArrowLeft } from "lucide-react";

interface PortfolioVideosProps {
  onNavigate: (page: string) => void;
}

const videoProjects = [
  {
    id: 1,
    title: 'Motion Reel 2025',
    category: 'Showreel',
    description: 'Compilação dos melhores trabalhos do ano',
    image: 'https://images.unsplash.com/photo-1758553173287-513ad13280b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjBjcmVhdGl2ZSUyMG1vZGVybnxlbnwxfHx8fDE3Njk1NTI4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 2,
    title: 'Brand Animation',
    category: 'Motion Graphics',
    description: 'Animação de logo e identidade visual',
    image: 'https://images.unsplash.com/photo-1764437180200-f0fd57fa15d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3Rpb24lMjBncmFwaGljcyUyMGFic3RyYWN0JTIwZ2VvbWV0cmljfGVufDF8fHx8MTc2OTU1Mjg3N3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 3,
    title: 'Social Media Content',
    category: 'Reels & Stories',
    description: 'Conteúdo dinâmico para redes sociais',
    image: 'https://images.unsplash.com/photo-1750056393300-102f7c4b8bc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZGVzaWduJTIwY3JlYXRpdmUlMjBtb2NrdXB8ZW58MXx8fHwxNzY5NTUyODc4fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 4,
    title: 'Product Showcase',
    category: 'Comercial',
    description: 'Vídeo promocional de produto',
    image: 'https://images.unsplash.com/photo-1726556267498-2f7cbbc94bf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRmb2xpbyUyMG1vZGVybiUyMGRlc2lnbnxlbnwxfHx8fDE3Njk1NTI4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 5,
    title: 'Event Recap',
    category: 'Cobertura',
    description: 'Resumo visual de evento corporativo',
    image: 'https://images.unsplash.com/photo-1763888450540-9b59abff803b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWQlMjBzY3JlZW4lMjBkaXNwbGF5JTIwZGlnaXRhbHxlbnwxfHx8fDE3Njk1NTQzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 6,
    title: 'Music Video',
    category: 'Artístico',
    description: 'Clipe com direção de fotografia criativa',
    image: 'https://images.unsplash.com/photo-1620983626305-88db754c9a29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwdXJiYW4lMjBuaWdodHxlbnwxfHx8fDE3Njk1NTQzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export function PortfolioVideos({ onNavigate }: PortfolioVideosProps, p0: number, title: any, p1: string, category: any, p2: string, description: any, p3: string, image: any, p4: string) {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: '#7c3aed' }}>

        
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
              Edição de <span style={{ color: '#fde68a' }}>Vídeos</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Conteúdo audiovisual que conta histórias e engaja audiências através de storytelling visual impactante
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoProjects.map((project, index) => (
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

export default PortfolioVideos;
