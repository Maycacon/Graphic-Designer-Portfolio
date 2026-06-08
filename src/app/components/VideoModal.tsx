import { Dialog, DialogContent } from "@/app/components/ui/dialog";

interface VideoModalProps {
  project: any | null;
  onClose: () => void;
}

export function VideoModal({ project, onClose }: VideoModalProps) {
  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] p-6 border-0 rounded-xl" style={{ backgroundColor: '#2d085e' }}>
        {project && (
          <div className="relative w-full flex justify-center items-center">
            <div 
              className="rounded-lg overflow-hidden border-2 flex justify-center items-center w-full"
              style={{ borderColor: '#fde68a', backgroundColor: '#000' }}
            >
              {/* Lógica: Mostra o vídeo SE existir, senão mostra a imagem */}
              {project.video ? (
                <video 
                  src={project.video as string} 
                  controls 
                  autoPlay 
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              ) : project.image ? (
                <img 
                  src={project.image as string} 
                  alt={project.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              ) : null}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}