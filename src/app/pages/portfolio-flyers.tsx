import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { AnimatedShapes } from "@/app/components/animated-shapes";
import { ArrowLeft, FileVideo } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";

interface PortfolioFlyersProps {
  onNavigate: (page: string) => void;
}

export const flyerProjects = [
  {
    id: 1,
    title: 'Campanha Digital',
    category: 'Redes Sociais',
    description: 'Flyers para Instagram e Facebook',
    video: 'https://res.cloudinary.com/da13zwelb/video/upload/v1774042362/atlantisEmpire_v8rnbq.mp4',
  },
  {
    id: 2,
    title: 'Evento Musical',
    category: 'Entretenimento',
    description: 'Material promocional para show',
    image: 'https://images.unsplash.com/photo-1726556267498-2f7cbbc94bf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRmb2xpbyUyMG1vZGVybiUyMGRlc2lnbnxlbnwxfHx8fDE3Njk1NTI4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3,
    title: 'Promoção Sazonal',
    category: 'Varejo',
    description: 'Flyer de ofertas especiais',
    image: 'https://images.unsplash.com/photo-1750056393300-102f7c4b8bc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZGVzaWduJTIwY3JlYXRpdmUlMjBtb2NrdXB8ZW58MXx8fHwxNzY5NTUyODc4fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 4,
    title: 'Identidade Visual',
    category: 'Branding',
    description: 'Kit completo de materiais gráficos',
    image: 'https://images.unsplash.com/photo-1639506523061-7359453854f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduZXIlMjB3b3Jrc3BhY2UlMjBwdXJwbGV8ZW58MXx8fHwxNzY5NTUyODc2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 5,
    title: 'Festival de Arte',
    category: 'Cultura',
    description: 'Peças gráficas para evento cultural',
    image: 'https://images.unsplash.com/photo-1764437180200-f0fd57fa15d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3Rpb24lMjBncmFwaGljcyUyMGFic3RyYWN0JTIwZ2VvbWV0cmljfGVufDF8fHx8MTc2OTU1Mjg3N3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 6,
    title: 'Cardápio Digital',
    category: 'Gastronomia',
    description: 'Design para delivery e QR code',
    image: 'https://images.unsplash.com/photo-1758553173287-513ad13280b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjBjcmVhdGl2ZSUyMG1vZGVybnxlbnwxfHx8fDE3Njk1NTI4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export function PortfolioFlyers({ onNavigate }: PortfolioFlyersProps, p0: number, title: any, p1: string, category: any, p2: string, description: any, p3: string, image: any, p4: string) {
  const [selectedProject, setSelectedProject] = useState<typeof flyerProjects[0] | null>(null);
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
            {flyerProjects.map((project, index) => (
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

export default PortfolioFlyers;
