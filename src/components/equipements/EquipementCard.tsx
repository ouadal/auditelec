"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Clock,
  Edit,
  Trash2,
  Eye,
  Battery,
  Calendar,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface EquipementCardProps {
  equipement: any;
  onEdit: (equipement: any) => void;
  onDelete: (equipement: any) => void;
  onShowEnergyDetails: (equipementId: number) => void;
}

export function EquipementCard({
  equipement,
  onEdit,
  onDelete,
  onShowEnergyDetails,
}: EquipementCardProps) {
  const getTypeValeurLabel = (type: string) => {
    switch (type) {
      case "puissance":
        return "Puissance (W)";
      case "courant":
        return "Courant (A)";
      case "tension":
        return "Tension (V)";
      case "energie":
        return "Énergie (kWh/an)";
      default:
        return type;
    }
  };

  const getUnite = (type: string) => {
    switch (type) {
      case "puissance":
        return "W";
      case "courant":
        return "A";
      case "tension":
        return "V";
      case "energie":
        return "kWh/an";
      default:
        return "";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">
                {equipement.nom_equipement}
              </CardTitle>
              {equipement.type_equipement && (
                <p className="text-sm text-muted-foreground">
                  {equipement.type_equipement.nom}
                </p>
              )}
            </div>
          </div>
          <Badge variant="outline">
            {equipement.nombre} unité{equipement.nombre > 1 ? "s" : ""}
          </Badge>
        </div>
        {equipement.piece && (
          <CardDescription className="flex items-center space-x-1">
            <span>{equipement.piece.nom_piece}</span>
            {equipement.piece.batiment && (
              <span> - {equipement.piece.batiment.nom_batiment}</span>
            )}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mesure principale */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {getTypeValeurLabel(equipement.type_valeur)}
          </span>
          <span className="font-bold">
            {equipement.valeur_mesuree} {getUnite(equipement.type_valeur)}
          </span>
        </div>

        {/* Énergie calculée */}
        {equipement.energie_avec_unite && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Battery className="h-4 w-4" />
                Énergie/jour
              </span>
              <span className="font-semibold text-green-600">
                {equipement.energie_avec_unite}
              </span>
            </div>

            {equipement.energie_mensuelle_avec_unite && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Énergie/mois
                </span>
                <span className="font-semibold text-blue-600">
                  {equipement.energie_mensuelle_avec_unite}
                </span>
              </div>
            )}

            {equipement.energie_annuelle_avec_unite && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Énergie/an
                </span>
                <span className="font-semibold text-orange-600">
                  {equipement.energie_annuelle_avec_unite}
                </span>
              </div>
            )}

            {equipement.consommation_annuelle && (
              <div className="flex items-center justify-between p-2 bg-orange-50 rounded border-l-4 border-orange-400">
                <span className="text-sm font-medium text-orange-800 flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  Total annuel ({equipement.nombre} unités)
                </span>
                <span className="font-bold text-orange-800">
                  {equipement.consommation_annuelle.toFixed(1)} kWh/an
                </span>
              </div>
            )}
          </div>
        )}

        {/* Temps d'utilisation */}
        {equipement.heures_utilisation_jour && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Utilisation
            </span>
            <span>{equipement.heures_utilisation_jour}h/jour</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {equipement.piece && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowEnergyDetails(equipement.id)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300"
              title="Voir les détails énergétiques de la pièce et du bâtiment"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(equipement)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300"
            title="Modifier l'équipement"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(equipement)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
            title="Supprimer l'équipement"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}