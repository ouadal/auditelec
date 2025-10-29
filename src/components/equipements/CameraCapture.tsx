"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoData: string) => void;
  stream: MediaStream | null;
}

export function CameraCapture({ isOpen, onClose, onCapture, stream }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !stream) return;

    console.log('Configuration du flux vidéo');
    videoElement.srcObject = stream;

    const handleLoadedMetadata = () => {
      console.log('Métadonnées vidéo chargées');
      videoElement.play().catch(error => {
        console.error('Erreur lors de la lecture de la vidéo:', error);
        toast({
          title: "Erreur",
          description: "Impossible de démarrer la vidéo. Veuillez réessayer.",
          variant: "destructive",
        });
      });
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      console.log('Nettoyage du flux vidéo');
      if (videoElement) {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.srcObject = null;
      }
    };
  }, [stream, toast]);

  const capturePhoto = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    try {
      // Créer un canvas aux dimensions de la vidéo
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // Dessiner l'image de la vidéo sur le canvas
      const context = canvas.getContext('2d');
      if (!context) {
        toast({
          title: "Erreur",
          description: "Impossible de capturer la photo. Contexte 2D non disponible.",
          variant: "destructive",
        });
        return;
      }

      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convertir le canvas en base64
      const photoData = canvas.toDataURL('image/jpeg');
      onCapture(photoData);
    } catch (error) {
      console.error('Erreur lors de la capture:', error);
      toast({
        title: "Erreur",
        description: "Impossible de capturer la photo. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <div className="w-full h-[400px] bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain bg-black rounded-lg"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={capturePhoto}>
            Prendre la photo
          </Button>
        </div>
      </div>
    </div>
  );
}