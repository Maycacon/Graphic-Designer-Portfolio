import { motion } from "motion/react";
import { FileVideo } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
interface ProjectCardProps {
  project: any;
  index: number;
  onClick: (project: any) => void;
  aspectRatio?: "video" | "portrait";
  variant?: "bottom" | "center";
}

export function ProjectCard({
  project,
  index,
  onClick,
  aspectRatio = "video",
  variant = "bottom",
}: ProjectCardProps) {
  const aspectClass = aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-video";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group relative cursor-pointer shadow-xl rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:shadow-2xl transition-all duration-300"
      onClick={() => onClick(project)} 
    >
      <div
        className={`${aspectClass} w-full bg-gray-200 dark:bg-gray-800 relative overflow-hidden`}
        onMouseEnter={(e) => {
          const video = e.currentTarget.querySelector("video");
          if (video) video.play().catch(() => {});
        }}
        onMouseLeave={(e) => {
          const video = e.currentTarget.querySelector("video");
          if (video) video.pause();
        }}
      >
        {/* Verifica tanto o banco de dados (_url) quanto o fallback */}
        {project.video_url || project.video ? (
          <>
            <video
              src={project.video_url || project.video}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              muted
              loop
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all duration-300 pointer-events-none">
              <div className="w-12 h-12  flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg rounded-full bg-white/20 backdrop-blur-sm">
                <img src="https://gyvlbupockscbeoxqsml.supabase.co/storage/v1/object/public/portfolio-media/images/incovideo.png" alt="Play Video" className="w-full h-full object-contain" />
              </div>
            </div>
          </>
        ) : (
          <ImageWithFallback
            src={project.image_url || project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Overlay Dinâmico de Texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          {variant === "bottom" ? (
            <div>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block"
                style={{ backgroundColor: "#fde68a", color: "#2d085e" }}
              >
                {project.category}
              </span>
              <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
              <p className="text-sm text-white/90 line-clamp-2">{project.description}</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full mb-2"
                style={{ backgroundColor: "#fde68a", color: "#1f1f1f" }}
              >
                {project.category}
              </span>
              <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
              <p className="text-sm text-white/80 line-clamp-2">{project.description}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}