'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onPhotoCapture: (photo: string) => void;
  onError?: (error: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoCapture,
  onError = (error) => {
    useToast().toast({ title: 'Erreur', description: error, variant: 'destructive' });
  }
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Utilise la caméra arrière par défaut sur mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (error) {
      onError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
    }
  }, [onError]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    try {
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      onPhotoCapture(photoData);
      stopCamera();
    } catch (error) {
      onError('Erreur lors de la capture de la photo.');
    }
  }, [onPhotoCapture, stopCamera, onError]);

  // Nettoyage lors du démontage du composant
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <Card className="p-4">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg shadow-lg"
          style={{ display: isStreaming ? 'block' : 'none' }}
          onCanPlay={() => {
            if (videoRef.current) {
              videoRef.current.play();
            }
          }}
        />
        
        <div className="flex justify-center gap-4 mt-4">
          {!isStreaming ? (
            <Button onClick={startCamera}>
              Activer la caméra
            </Button>
          ) : (
            <>
              <Button onClick={capturePhoto} variant="default">
                Prendre la photo
              </Button>
              <Button onClick={stopCamera} variant="destructive">
                Arrêter la caméra
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};