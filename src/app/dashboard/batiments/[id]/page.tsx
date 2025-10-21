"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingPage, LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Users,
  Ruler,
  Zap,
  TrendingUp,
  BarChart3,
  PieChart,
  Home,
  Lightbulb,
  Euro,
  Activity,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiHelpers } from "../../../../../services/apiHelpers";

interface Batiment {
  id: number;
  nom_batiment: string;
  adresse_site: string;
  commune: string;
  annee_mise_service: number;
  type_fonction: string;
  surface_totale: number;
  surface_climatisee: number;
  nb_travailleurs: number;
  client?: {
    id: number;
    contact_nom: string;
    contact_email: string;
  };
}

interface ResumeEnergetique {
  batiment_id: number;
  nom_batiment: string;
  adresse_site: string;
  commune: string;
  surface_totale: number;
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
  pieces_detail: Array<{
    id: number;
    nom: string;
    niveau: string;
    nombre_equipements: number;
    energie_jour_kWh: number;
    energie_mensuelle_kWh: number;
    energie_annuelle_kWh: number;
  }>;
}

interface StatistiqueParType {
  type: string;
  nombre_equipements: number;
  nombre_unites: number;
  energie_jour_kWh: number;
  energie_jour_avec_unite: string;
  energie_mensuelle_kWh: number;
  energie_mensuelle_avec_unite: string;
  energie_annuelle_kWh: number;
  energie_annuelle_avec_unite: string;
}

export default function BatimentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const batimentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [batiment, setBatiment] = useState<Batiment | null>(null);
  const [resumeEnergetique, setResumeEnergetique] = useState<ResumeEnergetique | null>(null);
  const [statistiquesParType, setStatistiquesParType] = useState<StatistiqueParType[]>([]);

  useEffect(() => {
    const loadBatimentData = async () => {
      try {
        setLoading(true);

        // Charger les données en parallèle
        const [batimentResponse, resumeResponse, statistiquesResponse] = await Promise.all([
          apiHelpers.batiments.getById(batimentId),
          apiHelpers.batiments.getResumeEnergetique(batimentId),
          apiHelpers.batiments.getStatistiquesParType(batimentId),
        ]);

        if (batimentResponse.data?.success) {
          setBatiment(batimentResponse.data.data.batiment || batimentResponse.data.data);
        }

        if (resumeResponse.data?.success) {
          setResumeEnergetique(resumeResponse.data.data);
        }

        if (statistiquesResponse.data?.success) {
          setStatistiquesParType(statistiquesResponse.data.data.statistiques_par_type || []);
        }

      } catch (error: any) {
        console.error("Erreur lors du chargement:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des données du bâtiment",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (batimentId) {
      loadBatimentData();
    }
  }, [batimentId, toast]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!batiment || !resumeEnergetique) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Building2 className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Bâtiment non trouvé</h2>
        <Button onClick={() => router.push("/dashboard/batiments")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux bâtiments
        </Button>
      </div>
    );
  }

  const getEfficaciteBadge = (intensite: number | null) => {
    if (!intensite) return { label: "N/A", variant: "secondary" as const };
    
    if (intensite <= 50) return { label: "Très efficace", variant: "default" as const };
    if (intensite <= 100) return { label: "Efficace", variant: "secondary" as const };
    if (intensite <= 200) return { label: "Modéré", variant: "outline" as const };
    return { label: "Énergivore", variant: "destructive" as const };
  };

  const efficacite = getEfficaciteBadge(resumeEnergetique.intensite_energetique_kWh_m2_an);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/batiments")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              {batiment.nom_batiment}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              {batiment.adresse_site}, {batiment.commune}
            </p>
          </div>
        </div>
        <Badge variant={efficacite.variant} className="text-sm">
          {efficacite.label}
        </Badge>
      </div>

      {/* Informations générales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Année de service</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batiment.annee_mise_service}</div>
            <p className="text-xs text-muted-foreground">
              {new Date().getFullYear() - batiment.annee_mise_service} ans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Surface totale</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batiment.surface_totale}</div>
            <p className="text-xs text-muted-foreground">m²</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Travailleurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batiment.nb_travailleurs}</div>
            <p className="text-xs text-muted-foreground">personnes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Type de fonction</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sm">{batiment.type_fonction}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(batiment.surface_totale / batiment.nb_travailleurs)} m²/pers.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Résumé énergétique principal */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Énergie/Jour</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {resumeEnergetique.energie_totale_jour_kWh.toFixed(1)}
            </div>
            <p className="text-xs text-green-600">kWh/jour</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Énergie/Mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {resumeEnergetique.energie_totale_mensuelle_kWh.toFixed(0)}
            </div>
            <p className="text-xs text-blue-600">kWh/mois</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Énergie/An</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">
              {resumeEnergetique.energie_totale_annuelle_kWh.toFixed(0)}
            </div>
            <p className="text-xs text-orange-600">kWh/an</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Coût/An</CardTitle>
            <Euro className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {resumeEnergetique.cout_annuel_estime_euros.toFixed(0)}
            </div>
            <p className="text-xs text-purple-600">€/an</p>
          </CardContent>
        </Card>
      </div>

      {/* Intensité énergétique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Énergétique
          </CardTitle>
          <CardDescription>
            Intensité énergétique et efficacité du bâtiment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {resumeEnergetique.intensite_energetique_kWh_m2_an?.toFixed(1) || "N/A"}
              </div>
              <p className="text-sm text-muted-foreground">kWh/m²/an</p>
              <p className="text-xs text-muted-foreground mt-1">Intensité énergétique</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {resumeEnergetique.nombre_equipements}
              </div>
              <p className="text-sm text-muted-foreground">équipements</p>
              <p className="text-xs text-muted-foreground mt-1">Total installé</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {resumeEnergetique.nombre_pieces}
              </div>
              <p className="text-sm text-muted-foreground">pièces</p>
              <p className="text-xs text-muted-foreground mt-1">Espaces équipés</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Répartition par type d'équipement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Répartition par Type d'Équipement
            </CardTitle>
            <CardDescription>
              Consommation énergétique par catégorie d'équipement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statistiquesParType.length > 0 ? (
              statistiquesParType.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary" style={{
                      backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
                    }} />
                    <div>
                      <p className="font-medium">{stat.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.nombre_equipements} équipements ({stat.nombre_unites} unités)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{stat.energie_annuelle_kWh.toFixed(0)} kWh/an</p>
                    <p className="text-sm text-muted-foreground">{stat.energie_jour_kWh.toFixed(1)} kWh/jour</p>
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

        {/* Détail par pièce */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Consommation par Pièce
            </CardTitle>
            <CardDescription>
              Répartition énergétique par espace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeEnergetique.pieces_detail.length > 0 ? (
              resumeEnergetique.pieces_detail
                .sort((a, b) => b.energie_annuelle_kWh - a.energie_annuelle_kWh)
                .map((piece, index) => (
                  <div key={piece.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lightbulb className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{piece.nom}</p>
                        <p className="text-sm text-muted-foreground">
                          {piece.niveau} • {piece.nombre_equipements} équipements
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{piece.energie_annuelle_kWh.toFixed(0)} kWh/an</p>
                      <p className="text-sm text-muted-foreground">{piece.energie_jour_kWh.toFixed(1)} kWh/jour</p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Aucune pièce avec équipements trouvée
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Gérer les équipements et générer des rapports
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button 
            onClick={() => router.push(`/dashboard/equipements?batiment_id=${batimentId}`)}
            className="flex-1"
          >
            <Zap className="mr-2 h-4 w-4" />
            Voir les Équipements
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/pieces?batiment_id=${batimentId}`)}
            className="flex-1"
          >
            <Home className="mr-2 h-4 w-4" />
            Gérer les Pièces
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              // TODO: Implémenter l'export de rapport
              toast({
                title: "Fonctionnalité à venir",
                description: "L'export de rapport sera bientôt disponible",
              });
            }}
            className="flex-1"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Exporter Rapport
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}