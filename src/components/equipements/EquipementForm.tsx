"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TempsUtilisationForm } from "./TempsUtilisationForm";
import {
  Save,
  X,
  Zap,
  Calculator,
} from "lucide-react";

interface EquipementFormProps {
  formData: any;
  pieces: any[];
  typesEquipement: any[];
  isEditing: boolean;
  loading: boolean;
  onInputChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function EquipementForm({
  formData,
  pieces,
  typesEquipement,
  isEditing,
  loading,
  onInputChange,
  onSubmit,
  onCancel,
}: EquipementFormProps) {


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
    <div className="space-y-6">


      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Informations de Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="piece">Pièce *</Label>
              <Select
                value={formData.piece_id > 0 ? formData.piece_id.toString() : ""}
                onValueChange={(value) => onInputChange("piece_id", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une pièce" />
                </SelectTrigger>
                <SelectContent>
                  {pieces.map((piece) => (
                    <SelectItem key={piece.id} value={piece.id.toString()}>
                      {piece.nom_piece}
                      {piece.batiment && ` - ${piece.batiment.nom_batiment}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type d'équipement *</Label>
              <Select
                value={
                  formData.type_equipement_id > 0
                    ? formData.type_equipement_id.toString()
                    : ""
                }
                onValueChange={(value) =>
                  onInputChange("type_equipement_id", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {typesEquipement.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'équipement *</Label>
              <Input
                id="nom"
                placeholder="ex: Climatiseur Split 12000 BTU"
                value={formData.nom_equipement}
                onChange={(e) => onInputChange("nom_equipement", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre d'unités</Label>
              <Input
                id="nombre"
                type="number"
                min="1"
                value={formData.nombre}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = parseInt(value);
                  onInputChange("nombre", isNaN(numValue) || numValue < 1 ? 1 : numValue);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mesures électriques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Mesures Électriques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type-valeur">Type de mesure</Label>
              <Select
                value={formData.type_valeur}
                onValueChange={(value) => onInputChange("type_valeur", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="puissance">Puissance (W)</SelectItem>
                  <SelectItem value="courant">Courant (A)</SelectItem>
                  <SelectItem value="tension">Tension (V)</SelectItem>
                  <SelectItem value="energie">Énergie (kWh/an)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valeur">Valeur mesurée</Label>
              <div className="flex">
                <Input
                  id="valeur"
                  type="number"
                  step="0.01"
                  value={formData.valeur_mesuree ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = parseFloat(value);
                    onInputChange("valeur_mesuree", isNaN(numValue) ? 0 : numValue);
                  }}
                  className="rounded-r-none"
                />
                <div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm">
                  {getUnite(formData.type_valeur)}
                </div>
              </div>
            </div>

            {/* Champs conditionnels */}
            {formData.type_valeur !== "puissance" &&
              formData.type_valeur !== "energie" && (
                <>
                  {formData.type_valeur !== "tension" && (
                    <div className="space-y-2">
                      <Label htmlFor="tension">Tension (V)</Label>
                      <Input
                        id="tension"
                        type="number"
                        placeholder="ex: 230"
                        value={formData.tension ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            onInputChange("tension", undefined);
                          } else {
                            const numValue = parseFloat(value);
                            onInputChange("tension", isNaN(numValue) ? undefined : numValue);
                          }
                        }}
                      />
                    </div>
                  )}

                  {formData.type_valeur !== "courant" && (
                    <div className="space-y-2">
                      <Label htmlFor="courant">Courant (A)</Label>
                      <Input
                        id="courant"
                        type="number"
                        placeholder="ex: 10"
                        value={formData.courant ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            onInputChange("courant", undefined);
                          } else {
                            const numValue = parseFloat(value);
                            onInputChange("courant", isNaN(numValue) ? undefined : numValue);
                          }
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="facteur">Facteur de puissance (cos φ)</Label>
                    <Input
                      id="facteur"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.facteur_puissance}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = parseFloat(value);
                        onInputChange("facteur_puissance", isNaN(numValue) || numValue <= 0 ? 1.0 : numValue);
                      }}
                    />
                  </div>
                </>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Temps d'utilisation */}
      <TempsUtilisationForm
        formData={formData}
        onInputChange={onInputChange}
      />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button onClick={onSubmit} disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Mettre à jour" : "Créer l'Équipement"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}