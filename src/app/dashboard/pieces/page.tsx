"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  Home,
  Zap,
  TrendingUp,
  Building2,
  BarChart3,
  Calendar,
  Euro,
  Lightbulb,
  Activity,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiHelpers } from "../../../../services/apiHelpers";

interface ResumePiece {
  piece_id: number;
  nom_piece: string;
  niveau: string;
  nombre_equipements: number;
  energie_totale_jour_kWh: number;
  energie_totale_jour_avec_unite: string;
  energie_totale_mensuelle_kWh: number;
  energie_totale_mensuelle_avec_unite: string;
  energie_totale_annuelle_kWh: number;
  energie_totale_annuelle_avec_unite: string;
  equipements_detail: Array<{
    id: number;
    nom: string;
    type: string;
    nombre: number;
    energie_jour_kWh: number;
    energie_annuelle_kWh: number;
  }>;
}

interface Batiment {
  id: number;
  nom_batiment: string;
  adresse_site: string;
  commune: string;
}

interface ResumesData {
  pieces: ResumePiece[];
  totaux: {
    nombre_pieces: number;
    nombre_equipements: number;
    energie_totale_jour_kWh: number;
    energie_totale_mensuelle_kWh: number;
    energie_totale_annuelle_kWh: number;
  };
}

export default function PiecesPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const batimentIdParam = searchParams.get("batiment_id");

  const [loading, setLoading] = useState(true);
  const [loadingBatiments, setLoadingBatiments] = useState(true);
  const [resumesData, setResumesData] = useState<ResumesData | null>(null);
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [selectedBatimentId, setSelectedBatimentId] = useState<string>(
    batimentIdParam || ""
  );

  // Charger la liste des bâtiments
  useEffect(() => {
    const loadBatiments = async () => {
      try {
        const response = await apiHelpers.batiments.getAll();
        const batimentsData = response.data?.data || [];
        setBatiments(Array.isArray(batimentsData) ? batimentsData : []);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des bâtiments:", error);
      } finally {
        setLoadingBatiments(false);
      }
    };

    loadBatiments();
  }, []);

  // Charger les résumés énergétiques des pièces
  useEffect(() => {
    const loadResumes = async () => {
      try {
        setLoading(true);
        console.log("🔄 Chargement des résumés énergétiques des pièces...");

        const batimentId = selectedBatimentId || null;
        const response = await apiHelpers.pieces.getResumesEnergetiques(
          batimentId as any
        );

        if (response.data?.success) {
          setResumesData(response.data.data);
          console.log("📊 Résumés des pièces:", response.data.data);
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement:", error);
        toast({
          title: "Erreur",
          description:
            "Erreur lors du chargement des données énergétiques des pièces",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!loadingBatiments) {
      loadResumes();
    }
  }, [selectedBatimentId, loadingBatiments, toast]);

  const handleBatimentChange = (value: string) => {
    setSelectedBatimentId(value);
    // Mettre à jour l'URL sans recharger la page
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("batiment_id", value);
    } else {
      url.searchParams.delete("batiment_id");
    }
    window.history.pushState({}, "", url.toString());
  };

  const selectedBatiment = batiments.find(
    (b) => b.id.toString() === selectedBatimentId
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const pieces = resumesData?.pieces || [];
  const totaux = resumesData?.totaux;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Pièces & Consommation Énergétique
          </h1>
        </div>
        <Badge variant="outline" className="text-sm">
          {pieces.length} pièce{pieces.length > 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Filtre par bâtiment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
          <CardDescription>Filtrer les pièces par bâtiment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select
                value={selectedBatimentId}
                onValueChange={handleBatimentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les bâtiments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les bâtiments</SelectItem>
                  {batiments.map((batiment) => (
                    <SelectItem
                      key={batiment.id}
                      value={batiment.id.toString()}
                    >
                      {batiment.nom_batiment} - {batiment.commune}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedBatiment && (
              <div className="text-sm text-muted-foreground">
                <Building2 className="inline h-4 w-4 mr-1" />
                {selectedBatiment.nom_batiment}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Résumé global */}
      {totaux && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pièces
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totaux.nombre_pieces}</div>
              <p className="text-xs text-muted-foreground">
                {selectedBatiment
                  ? `Dans ${selectedBatiment.nom_batiment}`
                  : "Tous bâtiments"}
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
                {totaux.nombre_equipements}
              </div>
              <p className="text-xs text-muted-foreground">
                Dans toutes les pièces
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Consommation/Jour
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totaux.energie_totale_jour_kWh.toFixed(1)} kWh
              </div>
              <p className="text-xs text-muted-foreground">Total journalier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Consommation/An
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totaux.energie_totale_annuelle_kWh.toLocaleString()} kWh
              </div>
              <p className="text-xs text-muted-foreground">Total annuel</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des pièces */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pieces
          .sort(
            (a, b) =>
              b.energie_totale_annuelle_kWh - a.energie_totale_annuelle_kWh
          )
          .map((piece) => (
            <Card
              key={piece.piece_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{piece.nom_piece}</CardTitle>
                    <CardDescription className="flex items-center space-x-1">
                      <Building2 className="h-3 w-3" />
                      <span>{piece.niveau}</span>
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      piece.nombre_equipements > 0 ? "default" : "secondary"
                    }
                  >
                    {piece.nombre_equipements} équipement
                    {piece.nombre_equipements > 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Consommation énergétique */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      Consommation/jour
                    </span>
                    <span className="font-semibold text-green-600">
                      {piece.energie_totale_jour_avec_unite}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Consommation/mois
                    </span>
                    <span className="font-semibold text-blue-600">
                      {piece.energie_totale_mensuelle_avec_unite}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Consommation/an
                    </span>
                    <span className="font-semibold text-orange-600">
                      {piece.energie_totale_annuelle_avec_unite}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                    <span className="text-sm font-medium text-purple-800 flex items-center gap-1">
                      <Euro className="h-4 w-4" />
                      Coût annuel estimé
                    </span>
                    <span className="font-bold text-purple-800">
                      {Math.round(
                        piece.energie_totale_annuelle_kWh * 0.15
                      ).toLocaleString()}{" "}
                      €
                    </span>
                  </div>
                </div>

                {/* Détail des équipements */}
                {piece.equipements_detail.length > 0 && (
                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      Équipements ({piece.equipements_detail.length})
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {piece.equipements_detail
                        .sort(
                          (a, b) =>
                            b.energie_annuelle_kWh - a.energie_annuelle_kWh
                        )
                        .map((equipement) => (
                          <div
                            key={equipement.id}
                            className="flex items-center justify-between text-xs p-2 bg-muted rounded"
                          >
                            <div>
                              <p className="font-medium">{equipement.nom}</p>
                              <p className="text-muted-foreground">
                                {equipement.type} • {equipement.nombre}x
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {equipement.energie_annuelle_kWh.toFixed(0)}{" "}
                                kWh/an
                              </p>
                              <p className="text-muted-foreground">
                                {equipement.energie_jour_kWh.toFixed(1)}{" "}
                                kWh/jour
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Navigation vers les équipements de cette pièce
                      window.location.href = `/dashboard/equipements?piece_id=${piece.piece_id}`;
                    }}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Voir équipements
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {pieces.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune pièce trouvée</h3>
            <p className="text-muted-foreground">
              {selectedBatiment
                ? `Aucune pièce avec équipements dans ${selectedBatiment.nom_batiment}.`
                : "Aucune pièce avec équipements trouvée."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
