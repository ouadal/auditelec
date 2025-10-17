'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X, Save } from 'lucide-react';
import { InstallationForm as InstallationFormType } from '@/types/electrical';

interface InstallationFormProps {
  initialData?: Partial<InstallationFormType>;
  onSubmit: (data: InstallationFormType) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function InstallationForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}: InstallationFormProps) {
  const [formData, setFormData] = useState<InstallationFormType>({
    client_id: initialData?.client_id || 1,
    type_compteur: initialData?.type_compteur || "BT",
    configuration_compteur: initialData?.configuration_compteur || "2 fils",
    amperage: initialData?.amperage || 20,
    composantes_coffret: initialData?.composantes_coffret || "",
    cable_type: initialData?.cable_type || "",
    commentaire_cable: initialData?.commentaire_cable || "",
    protection_terre: initialData?.protection_terre || false,
    barette_de_coupure: initialData?.barette_de_coupure || false,
    valeur_terre: initialData?.valeur_terre || 0,
    terre_dans_pc: initialData?.terre_dans_pc || false,
    presence_differentiel: initialData?.presence_differentiel || false,
    commentaire_terre: initialData?.commentaire_terre || "",
    date_installation: initialData?.date_installation || new Date().toISOString().split("T")[0],
    photo_coffret: initialData?.photo_coffret || [],
    photo_cable_electrique: initialData?.photo_cable_electrique || [],
    photo_type_cable: initialData?.photo_type_cable || [],
    photo_barette_coupure: initialData?.photo_barette_coupure || [],
    photo_terre_pc: initialData?.photo_terre_pc || [],
  });

  const [photoPreview, setPhotoPreview] = useState<{ [key: string]: string[] }>({});

  const handleInputChange = (field: keyof InstallationFormType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (files: FileList | null, fieldName: string) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const previewUrls: string[] = [];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          previewUrls.push(e.target.result as string);
          setPhotoPreview((prev) => ({
            ...prev,
            [fieldName]: [
              ...(prev[fieldName] || []),
              e.target!.result as string,
            ],
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    setFormData(prev => ({
      ...prev,
      [fieldName]: [
        ...(prev[fieldName as keyof InstallationFormType] as File[]),
        ...fileArray,
      ],
    }));
  };

  const removePhoto = (index: number, fieldName: string) => {
    setPhotoPreview((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName]?.filter((_, i) => i !== index) || [],
    }));

    setFormData(prev => ({
      ...prev,
      [fieldName]: (prev[fieldName as keyof InstallationFormType] as File[]).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const PhotoUploadSection = ({ 
    fieldName, 
    label, 
    description 
  }: { 
    fieldName: string; 
    label: string; 
    description?: string; 
  }) => (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files, fieldName)}
          className="hidden"
          id={`upload-${fieldName}`}
        />
        <label
          htmlFor={`upload-${fieldName}`}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">Cliquez pour ajouter des photos</span>
          <span className="text-xs text-gray-400">PNG, JPG jusqu'à 10MB</span>
        </label>
      </div>

      {photoPreview[fieldName] && photoPreview[fieldName].length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photoPreview[fieldName].map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removePhoto(index, fieldName)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations Générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type_compteur">Type de compteur</Label>
              <Select
                value={formData.type_compteur}
                onValueChange={(value) => handleInputChange('type_compteur', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BT">BT (Basse Tension)</SelectItem>
                  <SelectItem value="MT">MT (Moyenne Tension)</SelectItem>
                  <SelectItem value="HT">HT (Haute Tension)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="configuration_compteur">Configuration</Label>
              <Select
                value={formData.configuration_compteur}
                onValueChange={(value) => handleInputChange('configuration_compteur', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 fils">2 fils</SelectItem>
                  <SelectItem value="4 fils">4 fils</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amperage">Ampérage (A)</Label>
              <Input
                type="number"
                value={formData.amperage}
                onChange={(e) => handleInputChange('amperage', parseInt(e.target.value) || 0)}
                min="1"
                max="1000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_installation">Date d'installation</Label>
            <Input
              type="date"
              value={formData.date_installation}
              onChange={(e) => handleInputChange('date_installation', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Coffret électrique */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coffret Électrique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="composantes_coffret">Composantes du coffret</Label>
            <Textarea
              value={formData.composantes_coffret}
              onChange={(e) => handleInputChange('composantes_coffret', e.target.value)}
              placeholder="Décrivez les composantes du coffret électrique..."
              rows={3}
            />
          </div>

          <PhotoUploadSection
            fieldName="photo_coffret"
            label="Photos du coffret"
            description="Photos du coffret électrique et de ses composantes"
          />
        </CardContent>
      </Card>

      {/* Câblage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Câblage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cable_type">Type de câble</Label>
            <Input
              value={formData.cable_type}
              onChange={(e) => handleInputChange('cable_type', e.target.value)}
              placeholder="Ex: Cuivre 2.5mm², Aluminium 10mm²..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commentaire_cable">Commentaire sur le câblage</Label>
            <Textarea
              value={formData.commentaire_cable}
              onChange={(e) => handleInputChange('commentaire_cable', e.target.value)}
              placeholder="Observations sur le câblage..."
              rows={2}
            />
          </div>

          <PhotoUploadSection
            fieldName="photo_cable_electrique"
            label="Photos du câble électrique"
            description="Photos du câblage principal"
          />

          <PhotoUploadSection
            fieldName="photo_type_cable"
            label="Photos du type de câble"
            description="Photos montrant le type et les caractéristiques du câble"
          />
        </CardContent>
      </Card>

      {/* Protection et sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Protection et Sécurité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="protection_terre"
                  checked={formData.protection_terre}
                  onCheckedChange={(checked) => handleInputChange('protection_terre', checked)}
                />
                <Label htmlFor="protection_terre">Protection terre</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="presence_differentiel"
                  checked={formData.presence_differentiel}
                  onCheckedChange={(checked) => handleInputChange('presence_differentiel', checked)}
                />
                <Label htmlFor="presence_differentiel">Présence différentiel</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="barette_de_coupure"
                  checked={formData.barette_de_coupure}
                  onCheckedChange={(checked) => handleInputChange('barette_de_coupure', checked)}
                />
                <Label htmlFor="barette_de_coupure">Barette de coupure</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terre_dans_pc"
                  checked={formData.terre_dans_pc}
                  onCheckedChange={(checked) => handleInputChange('terre_dans_pc', checked)}
                />
                <Label htmlFor="terre_dans_pc">Terre dans PC</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="valeur_terre">Valeur terre (Ω)</Label>
                <Input
                  type="number"
                  value={formData.valeur_terre}
                  onChange={(e) => handleInputChange('valeur_terre', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commentaire_terre">Commentaire sur la terre</Label>
                <Textarea
                  value={formData.commentaire_terre}
                  onChange={(e) => handleInputChange('commentaire_terre', e.target.value)}
                  placeholder="Observations sur la protection terre..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {formData.barette_de_coupure && (
            <PhotoUploadSection
              fieldName="photo_barette_coupure"
              label="Photos barette de coupure"
              description="Photos de la barette de coupure"
            />
          )}

          {formData.terre_dans_pc && (
            <PhotoUploadSection
              fieldName="photo_terre_pc"
              label="Photos terre dans PC"
              description="Photos de la terre dans le PC"
            />
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
          {isEditing ? 'Modifier' : 'Créer'} l'installation
        </Button>
      </div>
    </form>
  );
}