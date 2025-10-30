'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X, Save, ToggleLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InterrupteurForm as InterrupteurFormType } from '@/types/electrical';
import { Modal } from '../ui/modal';

interface InterrupteurFormProps {
  initialData?: Partial<InterrupteurFormType>;
  onSubmit: (data: InterrupteurFormType) => void;
  onCancel: () => void;
  isEditing?: boolean;
  installationId: number;
}

export function InterrupteurForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing = false,
  installationId
}: InterrupteurFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InterrupteurFormType>({
    id: initialData?.id,
    installation_id: initialData?.installation_id || installationId,
    reference: initialData?.reference || "",
    etat: initialData?.etat || "bon",
    commentaire: initialData?.commentaire || "",
    localisation: initialData?.localisation || "",
    type_interrupteur: initialData?.type_interrupteur || "simple",
    ordre: initialData?.ordre || 1,
    photos: initialData?.photos || [],
  });

  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleInputChange = (field: keyof InterrupteurFormType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    // Limiter à 3 photos maximum
    const remainingSlots = 3 - formData.photos.length;
    const filesToAdd = fileArray.slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setPhotoPreview((prev) => [
            ...prev,
            e.target!.result as string,
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...filesToAdd],
    }));
  };

  const removePhoto = (index: number) => {
    setPhotoPreview((prev) => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const startCamera = async () => {
    try {
      console.log('Démarrage de la caméra...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      console.log('Flux vidéo obtenu:', stream);
      
      streamRef.current = stream;
      if (videoRef.current) {
        console.log('Affectation du flux à la vidéo...');
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            console.log('Lecture vidéo démarrée');
          } catch (error) {
            console.error('Erreur lors du démarrage de la lecture:', error);
          }
        };
      }
    } catch (err) {
      console.error('Erreur d\'accès à la caméra:', err);
      toast({
        title: 'Caméra indisponible',
        description: 'Vérifiez les permissions du navigateur.',
        variant: 'destructive'
      });
      setCameraOpen(false);
    }
  };

  const stopCamera = () => {
    console.log('Arrêt de la caméra...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Piste arrêtée:', track.label);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Ajouter la nouvelle photo
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, file]
      }));

      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(prev => [...prev, base64String]);
      };
      reader.readAsDataURL(blob);

      // Fermer la caméra
      stopCamera();
      setCameraOpen(false);
      
      toast({
        title: 'Photo capturée',
        description: 'Ajoutée au formulaire.',
        variant: 'default'
      });
    }, 'image/jpeg', 0.9);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCameraClick = async () => {
    setCameraOpen(true);
    await startCamera();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Modal 
        isOpen={cameraOpen} 
        onClose={() => {
          stopCamera();
          setCameraOpen(false);
        }}
        title="Caméra"
      >
        <div className="space-y-3">
          <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay 
              playsInline 
              muted
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => {
              stopCamera();
              setCameraOpen(false);
            }}>
              Fermer
            </Button>
            <Button type="button" onClick={capturePhoto} className="flex items-center gap-2">
              <Camera className="h-4 w-4" /> Capturer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Informations de l'interrupteur */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'interrupteur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ToggleLeft className="h-5 w-5 text-orange-600" />
                {isEditing ? 'Modifier l\'interrupteur' : 'Nouvel interrupteur'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence *</Label>
                  <Input
                    id="reference"
                    value={formData.reference}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                    placeholder="Ex: I001, INT-SALON-01..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ordre">Ordre</Label>
                  <Input
                    id="ordre"
                    type="number"
                    value={formData.ordre}
                    onChange={(e) => handleInputChange('ordre', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="etat">État *</Label>
                  <Select
                    value={formData.etat}
                    onValueChange={(value) => handleInputChange('etat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bon">Bon état</SelectItem>
                      <SelectItem value="defectueux">Défectueux</SelectItem>
                      <SelectItem value="non_installe">Non installé</SelectItem>
                      <SelectItem value="a_remplacer">À remplacer</SelectItem>
                      <SelectItem value="manquant">Manquant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type_interrupteur">Type d'interrupteur *</Label>
                  <Select
                    value={formData.type_interrupteur}
                    onValueChange={(value) => handleInputChange('type_interrupteur', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="triple">Triple</SelectItem>
                      <SelectItem value="va_et_vient">Va-et-vient</SelectItem>
                      <SelectItem value="poussoir">Poussoir</SelectItem>
                      <SelectItem value="detecteur">Détecteur de mouvement</SelectItem>
                      <SelectItem value="variateur">Variateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="localisation">Localisation</Label>
                <Input
                  id="localisation"
                  value={formData.localisation}
                  onChange={(e) => handleInputChange('localisation', e.target.value)}
                  placeholder="Ex: Entrée, Couloir, Chambre 1..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commentaire">Commentaire</Label>
                <Textarea
                  id="commentaire"
                  value={formData.commentaire}
                  onChange={(e) => handleInputChange('commentaire', e.target.value)}
                  placeholder="Observations, état détaillé, remarques..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section photos */}
          <div className="space-y-4">
            <Label>Photos de l'interrupteur</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                disabled={formData.photos.length >= 3}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCameraClick}
                disabled={formData.photos.length >= 3}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Photo
              </Button>
            </div>
            <p className="text-xs text-gray-600">
              Formats acceptés: JPEG, PNG, JPG - Maximum 3 photos
            </p>

            {photoPreview.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {photoPreview.map((preview, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={preview}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border hover:border-orange-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isEditing ? 'Modifier' : 'Ajouter'} l'interrupteur
        </Button>
      </div>
    </form>
  );
}