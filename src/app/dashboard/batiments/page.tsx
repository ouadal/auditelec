"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Building2,
  Zap,
  TrendingUp,
  MapPin,
  Users,
  Square,
  Calendar,
  Euro,
  BarChart3,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiHelpers from "../../../../services/apiHelpers";

interface BatimentAvecEnergie {
  id: number;
  nom_batiment: string;
  adresse_site: string;
  commune: string;
  surface_totale: number;
  client: {
    id: number;
    contact_nom: string;
    contact_email: string;
  };
  nombre_pieces: number;
  nombre_equipements: number;
  energie_totale_jour_kWh: number;
  energie_totale_jour_avec_unite: string;
  energie_totale_mensuelle_kWh: number;
  energie_totale_mensuelle_avec_unite: string;
  energie_totale_annuelle_kWh: number;
  energie_totale_annuelle_avec_unite: string;
  intensite_energetique_kWh_m2_an: number | null;
  intensite_energetique_avec_unite: string;
  cout_annuel_estime_euros: number;
}

export default function BatimentsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [batiments, setBatiments] = useState<BatimentAvecEnergie[]>([]);

  useEffect(() => {
    const loadBatiments = async () => {
      try {
        console.log("🔄 Chargement des bâtiments avec énergie...");
        const response = await apiHelpers.batiments.getAllAvecEnergie();
        const batimentsData = response.data?.data || [];
        console.log("📊 Bâtiments avec énergie:", batimentsData);
        setBatiments(Array.isArray(batimentsData) ? batimentsData : []);
      } catch (error) {
        console.error("❌ Erreur lors du chargement:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des bâtiments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBatiments();
  }, [toast]);

  const getIntensiteColor = (intensite: number | null) => {
    if (!intensite) return "bg-gray-100 text-gray-600";
    if (intensite < 50) return "bg-green-100 text-green-800";
    if (intensite < 100) return "bg-yellow-100 text-yellow-800";
    if (intensite < 200) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const getIntensiteLabel = (intensite: number | null) => {
    if (!intensite) return "Non défini";
    if (intensite < 50) return "Très efficace";
    if (intensite < 100) return "Efficace";
    if (intensite < 200) return "Modéré";
    return "Énergivore";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const totalEnergie = batiments.reduce((sum, b) => sum + b.energie_totale_annuelle_kWh, 0);
  const totalCout = batiments.reduce((sum, b) => sum + b.cout_annuel_estime_euros, 0);
  const totalEquipements = batiments.reduce((sum, b) => sum + b.nombre_equipements, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Bâtiments & Énergie
          </h1>
        </div>
        <Badge variant="outline" className="text-sm">
          {batiments.length} bâtiment{batiments.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Résumé global */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consommation Totale
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEnergie.toLocaleString()} kWh/an
            </div>
            <p className="text-xs text-muted-foreground">
              Tous bâtiments confondus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Coût Annuel Estimé
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCout.toLocaleString()} €
            </div>
            <p className="text-xs text-muted-foreground">
              Basé sur 0.15€/kWh
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Équipements
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEquipements}
            </div>
            <p className="text-xs text-muted-foreground">
              Dans {batiments.length} bâtiment{batiments.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Intensité Moyenne
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batiments.length > 0 
                ? Math.round(batiments.reduce((sum, b) => sum + (b.intensite_energetique_kWh_m2_an || 0), 0) / batiments.length)
                : 0
              } kWh/m²/an
            </div>
            <p className="text-xs text-muted-foreground">
              Intensité énergétique
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des bâtiments */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {batiments.map((batiment) => (
          <Card key={batiment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{batiment.nom_batiment}</CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{batiment.commune}</span>
                  </CardDescription>
                </div>
                <Badge 
                  className={getIntensiteColor(batiment.intensite_energetique_kWh_m2_an)}
                >
                  {getIntensiteLabel(batiment.intensite_energetique_kWh_m2_an)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Informations de base */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <span>{batiment.surface_totale} m²</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{batiment.client?.contact_nom || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{batiment.nombre_pieces} pièces</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span>{batiment.nombre_equipements} équipements</span>
                </div>
              </div>

              {/* Consommation énergétique */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Consommation/jour
                  </span>
                  <span className="font-semibold text-green-600">
                    {batiment.energie_totale_jour_avec_unite}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Consommation/an
                  </span>
                  <span className="font-semibold text-blue-600">
                    {batiment.energie_totale_annuelle_avec_unite}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Intensité énergétique
                  </span>
                  <span className="font-semibold text-orange-600">
                    {batiment.intensite_energetique_avec_unite}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-orange-50 rounded border-l-4 border-orange-400">
                  <span className="text-sm font-medium text-orange-800 flex items-center gap-1">
                    <Euro className="h-4 w-4" />
                    Coût annuel estimé
                  </span>
                  <span className="font-bold text-orange-800">
                    {batiment.cout_annuel_estime_euros.toLocaleString()} €
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Navigation vers le détail du bâtiment
                    window.location.href = `/dashboard/batiments/${batiment.id}`;
                  }}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {batiments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun bâtiment trouvé</h3>
            <p className="text-muted-foreground">
              Commencez par créer un bâtiment pour voir les données énergétiques.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}