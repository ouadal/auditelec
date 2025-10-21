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
      className={`cursor-pointer transition-all ${
        isSelected
          ? "ring-2 ring-blue-500 bg-blue-50"
          : "hover:bg-gray-50"
      }`}
      onClick={() => onSelect(installation)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* En-tête principal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {installation.type_compteur} - {installation.configuration_compteur} - {installation.amperage}A
                </h3>
                <div className="text-sm text-gray-600">
                  {new Date(installation.date_installation).toLocaleDateString("fr-FR")}
                </div>
                {installation.client && (
                  <div className="text-xs text-blue-600 font-medium">
                    Projet: {installation.client.contact_nom}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => onEdit(installation, e)}
                title="Modifier l'installation"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => onDelete(installation, e)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Supprimer l'installation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Coffret:</span>
              <p className="text-gray-600">
                {installation.composantes_coffret || "Non spécifié"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Câble:</span>
              <p className="text-gray-600">
                {installation.cable_type || "Non spécifié"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Terre:</span>
              <p className="text-gray-600">
                {installation.protection_terre
                  ? `${installation.valeur_terre}Ω`
                  : "Aucune"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Différentiel:</span>
              <p className="text-gray-600">
                {installation.presence_differentiel ? "Oui" : "Non"}
              </p>
            </div>
          </div>

          {/* Photos - Icône œil */}
          {totalPhotos > 0 && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium text-gray-700">
                Photos ({totalPhotos})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => onViewPhotos(installation, e)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4 text-blue-600" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}