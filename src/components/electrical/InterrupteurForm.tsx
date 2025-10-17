'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleLeft, Upload, X, Save } from 'lucide-react';
import { InterrupteurForm as InterrupteurFormType } from '@/types/electrical';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Photos de l'interrupteur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.photos.length < 3 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
                id="upload-photos-interrupteur"
              />
              <label
                htmlFor="upload-photos-interrupteur"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Cliquez pour ajouter des photos ({formData.photos.length}/3)
                </span>
                <span className="text-xs text-gray-400">PNG, JPG jusqu'à 10MB</span>
              </label>
            </div>
          )}

          {photoPreview.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {photoPreview.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.photos.length >= 3 && (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-600 font-medium">
                ✅ Maximum de 3 photos atteint
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isEditing ? 'Modifier' : 'Créer'} l'interrupteur
        </Button>
      </div>
    </form>
  );
}