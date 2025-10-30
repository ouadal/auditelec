"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Upload, X, Save } from "lucide-react";
import { InstallationForm as InstallationFormType } from "@/types/electrical";

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
  isEditing = false,
}: InstallationFormProps) {
  type PhotoField =
    | "photo_coffret"
    | "photo_cable_electrique"
    | "photo_type_cable"
    | "photo_barette_coupure"
    | "photo_terre_pc";

  const [formData, setFormData] = useState<InstallationFormType>({
    client_id: initialData?.client_id ?? 0,
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
    date_installation:
      initialData?.date_installation || new Date().toISOString().split("T")[0],
    photo_coffret: initialData?.photo_coffret || [],
    photo_cable_electrique: initialData?.photo_cable_electrique || [],
    photo_type_cable: initialData?.photo_type_cable || [],
    photo_barette_coupure: initialData?.photo_barette_coupure || [],
    photo_terre_pc: initialData?.photo_terre_pc || [],
  });

  const [photoPreview, setPhotoPreview] = useState<{ [key: string]: string[] }>(
    {}
  );

  // Camera state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<PhotoField | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleInputChange = (field: keyof InstallationFormType, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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

    setFormData((prev) => ({
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

    setFormData((prev) => ({
      ...prev,
      [fieldName]: (
        prev[fieldName as keyof InstallationFormType] as File[]
      ).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sécurité: éviter un envoi sans client
    if (!formData.client_id || formData.client_id === 0) {
      alert("Veuillez sélectionner un client avant de créer l'installation.");
      return;
    }
    onSubmit(formData);
  };

  const startCamera = async (field: PhotoField) => {
    try {
      setCameraTarget(field);
      setCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      // Optionally, we could add a toast here
      setCameraOpen(false);
      setCameraTarget(null);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !cameraTarget) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.9));
    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });

    // Update form data with new file
    setFormData((prev) => ({
      ...prev,
      [cameraTarget]: [
        ...((prev[cameraTarget] as File[]) || []),
        file,
      ],
    }));

    // Update preview
    const url = URL.createObjectURL(file);
    setPhotoPreview((prev) => ({
      ...prev,
      [cameraTarget]: [ ...(prev[cameraTarget] || []), url ],
    }));

    // Close camera
    stopCamera();
    setCameraOpen(false);
    setCameraTarget(null);
  };

  const PhotoUploadSection = ({
    fieldName,
    label,
    description,
  }: {
    fieldName: string;
    label: string;
    description?: string;
  }) => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files, fieldName)}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => startCamera(fieldName as PhotoField)}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Photo
        </Button>
      </div>
      <p className="text-xs text-gray-600">
        Formats acceptés: JPEG, PNG, JPG - Maximum 10MB
      </p>

      {(photoPreview[fieldName]?.length || (formData[fieldName as keyof InstallationFormType] as File[])?.length) ? (
        <div className="grid grid-cols-3 gap-4">
          {(photoPreview[fieldName] && photoPreview[fieldName].length > 0
            ? photoPreview[fieldName]
            : ((formData[fieldName as keyof InstallationFormType] as File[]) || []).map((file) => URL.createObjectURL(file))
          ).map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={preview}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border hover:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => removePhoto(index, fieldName)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <Dialog open={cameraOpen} onOpenChange={(open) => {
        if (!open) {
          stopCamera();
          setCameraOpen(false);
          setCameraTarget(null);
        } else {
          setCameraOpen(true);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Caméra</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <video ref={videoRef} className="w-full rounded bg-black" autoPlay playsInline />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                stopCamera();
                setCameraOpen(false);
                setCameraTarget(null);
              }}>
                Fermer
              </Button>
              <Button type="button" onClick={capturePhoto} className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> Capturer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
                onValueChange={(value) =>
                  handleInputChange("type_compteur", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BT">BT (Basse Tension)</SelectItem>
                  <SelectItem value="MT">MT (Moyenne Tension)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="configuration_compteur">Configuration</Label>
              <Select
                value={formData.configuration_compteur}
                onValueChange={(value) =>
                  handleInputChange("configuration_compteur", value)
                }
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
                onChange={(e) =>
                  handleInputChange("amperage", parseInt(e.target.value) || 0)
                }
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
              onChange={(e) =>
                handleInputChange("date_installation", e.target.value)
              }
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
              onChange={(e) =>
                handleInputChange("composantes_coffret", e.target.value)
              }
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
              onChange={(e) => handleInputChange("cable_type", e.target.value)}
              placeholder="Ex: Cuivre 2.5mm², Aluminium 10mm²..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commentaire_cable">
              Commentaire sur le câblage
            </Label>
            <Textarea
              value={formData.commentaire_cable}
              onChange={(e) =>
                handleInputChange("commentaire_cable", e.target.value)
              }
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
                  onCheckedChange={(checked) =>
                    handleInputChange("protection_terre", checked)
                  }
                />
                <Label htmlFor="protection_terre">Protection terre</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="presence_differentiel"
                  checked={formData.presence_differentiel}
                  onCheckedChange={(checked) =>
                    handleInputChange("presence_differentiel", checked)
                  }
                />
                <Label htmlFor="presence_differentiel">
                  Présence différentiel
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="barette_de_coupure"
                  checked={formData.barette_de_coupure}
                  onCheckedChange={(checked) =>
                    handleInputChange("barette_de_coupure", checked)
                  }
                />
                <Label htmlFor="barette_de_coupure">Barette de coupure</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terre_dans_pc"
                  checked={formData.terre_dans_pc}
                  onCheckedChange={(checked) =>
                    handleInputChange("terre_dans_pc", checked)
                  }
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
                  onChange={(e) =>
                    handleInputChange(
                      "valeur_terre",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commentaire_terre">
                  Commentaire sur la terre
                </Label>
                <Textarea
                  value={formData.commentaire_terre}
                  onChange={(e) =>
                    handleInputChange("commentaire_terre", e.target.value)
                  }
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
          {isEditing ? "Modifier" : "Créer"} l'installation
        </Button>
      </div>
    </form>
  );
}
