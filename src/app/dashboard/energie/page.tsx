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
  Zap,
  TrendingUp,
  Building2,
  Home,
  BarChart3,
  PieChart,
  Euro,
  Activity,
  Lightbulb,
  Wind,
  Monitor,
  Thermometer,
  Award,
  AlertTriangle,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiHelpers } from "../../../../services/apiHelpers";

interface StatistiquesGenerales {
  equipements: {
    total: number;
    par_type: Array<{
      type: string;
      nombre: number;
    }>;
    par_piece: Array<{
      piece: string;
      batiment: string;
      nombre: number;
    }>;
  };
  infrastructure: {
    batiments: number;
    pieces: number;
    types_equipements: number;
  };
  consommation_energetique: {
    jour: {
      valeur: number;
      unite: string;
    };
    mois: {
      valeur: number;
      unite: string;
    };
    annee: {
      valeur: number;
      unite: string;
    };
  };
  repartition_energetique: Array<{
    type: string;
    consommation_kWh_an: number;
    pourcentage: number;
  }>;
}

interface StatistiqueParType {
  type: string;
  nombre_equipements: number;
  consommation_jour_kWh: number;
  consommation_annee_kWh: number;
  pourcentage_equipements: number;
}

interface TopConsommateur {
  nom: string;
  type: string;
  piece: string;
  consommation_annuelle_kWh: number;
  cout_annuel_euros: number;
}

export default function EnergiePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [statistiquesGenerales, setStatistiquesGenerales] = useState<StatistiquesGenerales | null>(null);
  const [statistiquesParType, setStatistiquesParType] = useState<StatistiqueParType[]>([]);
  const [topConsommateurs, setTopConsommateurs] = useState<TopConsommateur[]>([]);

  useEffect(() => {
    const loadStatistiques = async () => {
      try {
        setLoading(true);
        console.log("🔄 Chargement des statistiques énergétiques...");

        // Charger toutes les statistiques en parallèle
        const [generalesResponse, parTypeResponse, topResponse] = await Promise.all([
          apiHelpers.statistiques.getAll(),
          apiHelpers.statistiques.getParType(),
          apiHelpers.statistiques.getTopConsommateurs(10),
        ]);

        if (generalesResponse.data?.success) {
          setStatistiquesGenerales(generalesResponse.data.data);
          console.log("📊 Statistiques générales:", generalesResponse.data.data);
        }

        if (parTypeResponse.data?.success) {
          setStatistiquesParType(parTypeResponse.data.data);
          console.log("📊 Statistiques par type:", parTypeResponse.data.data);
        }

        if (topResponse.data?.success) {
          setTopConsommateurs(topResponse.data.data);
          console.log("📊 Top consommateurs:", topResponse.data.data);
        }

      } catch (error) {
        console.error("❌ Erreur lors du chargement:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des statistiques énergétiques",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStatistiques();
  }, [toast]);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'climatisation':
        return <Wind className="h-5 w-5" />;
      case 'éclairage':
        return <Lightbulb className="h-5 w-5" />;
      case 'informatique':
        return <Monitor className="h-5 w-5" />;
      case 'chauffage':
        return <Thermometer className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  const getTypeColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-yellow-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-orange-500"
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!statistiquesGenerales) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Activity className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Aucune donnée disponible</h2>
        <p className="text-muted-foreground">Les statistiques énergétiques ne sont pas disponibles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de Bord Énergétique
          </h1>
        </div>
        <Badge variant="outline" className="text-sm">
          Vue d'ensemble
        </Badge>
      </div>

      {/* Métriques principales */}
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
              {statistiquesGenerales.consommation_energetique.annee.valeur.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {statistiquesGenerales.consommation_energetique.annee.unite}
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
              {Math.round(statistiquesGenerales.consommation_energetique.annee.valeur * 0.15).toLocaleString()} €
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
              {statistiquesGenerales.equipements.total}
            </div>
            <p className="text-xs text-muted-foreground">
              Dans {statistiquesGenerales.infrastructure.pieces} pièces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Infrastructure
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistiquesGenerales.infrastructure.batiments}
            </div>
            <p className="text-xs text-muted-foreground">
              bâtiments surveillés
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Répartition par type d'équipement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Répartition par Type d'Équipement
            </CardTitle>
            <CardDescription>
              Consommation énergétique par catégorie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statistiquesParType.length > 0 ? (
              statistiquesParType.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getTypeColor(index)}`} />
                    <div className="flex items-center gap-2">
                      {getTypeIcon(stat.type)}
                      <div>
                        <p className="font-medium">{stat.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {stat.nombre_equipements} équipements ({stat.pourcentage_equipements.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{stat.consommation_annee_kWh.toFixed(0)} kWh/an</p>
                    <p className="text-sm text-muted-foreground">{stat.consommation_jour_kWh.toFixed(1)} kWh/jour</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Aucune donnée de répartition disponible
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top consommateurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Consommateurs
            </CardTitle>
            <CardDescription>
              Équipements les plus énergivores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topConsommateurs.length > 0 ? (
              topConsommateurs.slice(0, 8).map((equipement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{equipement.nom}</p>
                      <p className="text-sm text-muted-foreground">
                        {equipement.type} • {equipement.piece}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{equipement.consommation_annuelle_kWh.toFixed(0)} kWh/an</p>
                    <p className="text-sm text-muted-foreground">{equipement.cout_annuel_euros.toFixed(0)} €/an</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Aucun équipement trouvé
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Consommation journalière vs mensuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Évolution de la Consommation
          </CardTitle>
          <CardDescription>
            Répartition temporelle de la consommation énergétique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-700">
                {statistiquesGenerales.consommation_energetique.jour.valeur.toFixed(1)}
              </div>
              <p className="text-sm text-green-600 font-medium">kWh/jour</p>
              <p className="text-xs text-green-600 mt-1">Consommation quotidienne</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-700">
                {statistiquesGenerales.consommation_energetique.mois.valeur.toFixed(0)}
              </div>
              <p className="text-sm text-blue-600 font-medium">kWh/mois</p>
              <p className="text-xs text-blue-600 mt-1">Consommation mensuelle</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-3xl font-bold text-orange-700">
                {statistiquesGenerales.consommation_energetique.annee.valeur.toFixed(0)}
              </div>
              <p className="text-sm text-orange-600 font-medium">kWh/an</p>
              <p className="text-xs text-orange-600 mt-1">Consommation annuelle</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommandations Énergétiques
          </CardTitle>
          <CardDescription>
            Suggestions d'optimisation basées sur l'analyse des données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topConsommateurs.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Équipements énergivores détectés</p>
                <p className="text-sm text-yellow-700">
                  Les {Math.min(3, topConsommateurs.length)} équipements les plus consommateurs représentent{" "}
                  {Math.round(
                    (topConsommateurs.slice(0, 3).reduce((sum, eq) => sum + eq.consommation_annuelle_kWh, 0) /
                    statistiquesGenerales.consommation_energetique.annee.valeur) * 100
                  )}% de la consommation totale.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <Award className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Suivi énergétique actif</p>
              <p className="text-sm text-green-700">
                Vous surveillez {statistiquesGenerales.equipements.total} équipements dans{" "}
                {statistiquesGenerales.infrastructure.batiments} bâtiment{statistiquesGenerales.infrastructure.batiments > 1 ? 's' : ''}.
                Continuez le monitoring pour optimiser la consommation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Potentiel d'économie</p>
              <p className="text-sm text-blue-700">
                En optimisant les 20% d'équipements les plus consommateurs, vous pourriez économiser jusqu'à{" "}
                {Math.round(statistiquesGenerales.consommation_energetique.annee.valeur * 0.15 * 0.15)} € par an.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}