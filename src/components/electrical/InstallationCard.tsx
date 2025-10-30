"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Edit, Eye, Trash2 } from "lucide-react";
import { Installation } from "@/types/electrical";

interface InstallationCardProps {
  installation: Installation;
  isSelected: boolean;
  onSelect: (installation: Installation) => void;
  onEdit: (installation: Installation, e: React.MouseEvent) => void;
  onDelete: (installation: Installation, e: React.MouseEvent) => void;
  onViewPhotos: (installation: Installation, e: React.MouseEvent) => void;
}

export function InstallationCard({
  installation,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onViewPhotos,
}: InstallationCardProps) {
  const totalPhotos = 
    (installation.photo_coffret?.length || 0) +
    (installation.photo_cable_electrique?.length || 0) +
    (installation.photo_type_cable?.length || 0) +
    (installation.photo_barette_coupure?.length || 0) +
    (installation.photo_terre_pc?.length || 0);

  return (
    <Card
      className={`relative cursor-pointer transition-all rounded-lg ${
        isSelected
          ? "ring-2 ring-blue-500 bg-blue-50"
          : "hover:bg-gray-50"
      }`}
      onClick={() => onSelect(installation)}
    >
      <CardContent className="p-4 space-y-4">
        {/* En-tête principal */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {installation.type_compteur} - {installation.configuration_compteur} - {installation.amperage}A
            </h3>
            <div className="text-sm text-gray-600">
              {new Date(installation.date_installation).toLocaleDateString("fr-FR")}
            </div>
            {installation.client && (
              <div className="text-sm text-blue-600 font-medium">
                Projet: {installation.client.contact_nom}
              </div>
            )}
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="font-medium text-gray-700">Coffret:</span>
            <p className="text-gray-600">
              {installation.composantes_coffret || "Non spécifié"}
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-gray-700">Câble:</span>
            <p className="text-gray-600">
              {installation.cable_type || "Non spécifié"}
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-gray-700">Terre:</span>
            <p className="text-gray-600">
              {installation.protection_terre
                ? `${installation.valeur_terre}Ω`
                : "Aucune"}
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-gray-700">Différentiel:</span>
            <p className="text-gray-600">
              {installation.presence_differentiel ? "Oui" : "Non"}
            </p>
          </div>
        </div>

        {/* Photos - Icône œil */}
        {totalPhotos > 0 && (
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-sm font-medium text-gray-700">
              Photos ({totalPhotos})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => onViewPhotos(installation, e)}
              className="h-8 w-8 p-0 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 text-blue-600" />
            </Button>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => onEdit(installation, e)}
            className="h-8 w-8 p-0 hover:bg-blue-50"
            title="Modifier l'installation"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => onDelete(installation, e)}
            className="h-8 w-8 p-0 hover:bg-red-50"
            title="Supprimer l'installation"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}