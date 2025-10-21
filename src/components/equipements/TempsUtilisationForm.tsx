"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface TempsUtilisationFormProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

export function TempsUtilisationForm({ formData, onInputChange }: TempsUtilisationFormProps) {
  const jours = [
    { key: "lundi", label: "Lundi" },
    { key: "mardi", label: "Mardi" },
    { key: "mercredi", label: "Mercredi" },
    { key: "jeudi", label: "Jeudi" },
    { key: "vendredi", label: "Vendredi" },
    { key: "samedi", label: "Samedi" },
    { key: "dimanche", label: "Dimanche" },
  ];

  // Fonction helper pour gérer les valeurs numériques correctement
  const handleNumberChange = (field: string, value: string) => {
    if (value === "") {
      onInputChange(field, undefined);
    } else {
      const numValue = parseFloat(value);
      onInputChange(field, isNaN(numValue) ? undefined : numValue);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Temps d'Utilisation
        </CardTitle>
        <CardDescription>
          Configurez les heures d'utilisation pour calculer l'énergie consommée
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration simple */}
        <div className="space-y-2">
          <Label htmlFor="heures-jour">Heures d'utilisation par jour (simple)</Label>
          <div className="flex">
            <Input
              id="heures-jour"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.heures_utilisation_jour ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  onInputChange("heures_utilisation_jour", undefined);
                } else {
                  const numValue = parseFloat(value);
                  onInputChange("heures_utilisation_jour", isNaN(numValue) ? undefined : numValue);
                }
              }}
              className="rounded-r-none"
            />
            <div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm">
              h/jour
            </div>
          </div>
        </div>

        {/* Configuration hebdomadaire détaillée */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Configuration Hebdomadaire Détaillée</Label>
          <p className="text-sm text-muted-foreground">
            Configurez les heures d'utilisation pour chaque jour de la semaine
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {jours.map((jour) => (
              <div key={jour.key} className="space-y-2">
                <Label className="font-medium">{jour.label}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`${jour.key}-diurne`} className="text-xs text-muted-foreground">
                      Diurne (6h-18h)
                    </Label>
                    <div className="flex">
                      <Input
                        id={`${jour.key}-diurne`}
                        type="number"
                        step="0.5"
                        min="0"
                        max="12"
                        value={formData[`${jour.key}_diurne`] ?? ""}
                        onChange={(e) => handleNumberChange(`${jour.key}_diurne`, e.target.value)}
                        className="rounded-r-none text-sm"
                      />
                      <div className="flex items-center px-2 bg-muted border border-l-0 rounded-r-md text-xs">
                        h
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`${jour.key}-nocturne`} className="text-xs text-muted-foreground">
                      Nocturne (18h-6h)
                    </Label>
                    <div className="flex">
                      <Input
                        id={`${jour.key}-nocturne`}
                        type="number"
                        step="0.5"
                        min="0"
                        max="12"
                        value={formData[`${jour.key}_nocturne`] ?? ""}
                        onChange={(e) => handleNumberChange(`${jour.key}_nocturne`, e.target.value)}
                        className="rounded-r-none text-sm"
                      />
                      <div className="flex items-center px-2 bg-muted border border-l-0 rounded-r-md text-xs">
                        h
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Résumé hebdomadaire */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-2">Résumé Hebdomadaire</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total diurne:</span>
              <span className="ml-2 font-medium">
                {jours.reduce((total, jour) => total + (formData[`${jour.key}_diurne`] ?? 0), 0).toFixed(1)}h
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total nocturne:</span>
              <span className="ml-2 font-medium">
                {jours.reduce((total, jour) => total + (formData[`${jour.key}_nocturne`] ?? 0), 0).toFixed(1)}h
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Total hebdomadaire:</span>
              <span className="ml-2 font-medium">
                {jours.reduce(
                  (total, jour) => 
                    total + (formData[`${jour.key}_diurne`] ?? 0) + (formData[`${jour.key}_nocturne`] ?? 0),
                  0
                ).toFixed(1)}h
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}