"use client";

import { useEffect, useState } from "react";
import { apiHelpers } from "../../../../services/apiHelpers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { LoadingPage } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, Pencil, PlusCircle, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast"; // ✅ pour les notifications

interface Room {
  id: number;
  name: string;
  level: string;
  manager: string;
  batiment_id?: number;
}

const levels = [
  { value: "RDC", label: "RDC (Niveau 0)" },
  { value: "R+1", label: "R+1 (Niveau 1)" },
  { value: "R+2", label: "R+2 (Niveau 2)" },
  { value: "R+3", label: "R+3 (Niveau 3)" },
  { value: "R+4", label: "R+4 (Niveau 4)" },
  { value: "R+5", label: "R+5 (Niveau 5)" },
  { value: "R+6", label: "R+6 (Niveau 6)" },
  { value: "R+7", label: "R+7 (Niveau 7)" },
];

export default function AuditPage() {
  const { toast } = useToast();
  const [date] = useState<Date>(new Date()); // Date automatique, non modifiable
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Chargement des données..."
  );
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  const [selectedBatiment, setSelectedBatiment] = useState<any>(null);
  const [batimentId, setBatimentId] = useState<string | null>(null);
  const [availableBatiments, setAvailableBatiments] = useState<any[]>([]);

  // ✅ Charger les données depuis le backend Laravel
  useEffect(() => {
    // Récupérer le batiment_id depuis l'URL si présent (venant d'une autre page)
    const urlParams = new URLSearchParams(window.location.search);
    const currentBatimentId = urlParams.get("batiment_id");
    setBatimentId(currentBatimentId);

    const loadData = async () => {
      try {
        console.log("🚀 Chargement des données...");
        setLoadingMessage("Chargement des bâtiments...");

        // Charger la liste des bâtiments
        const batimentsResponse = await apiHelpers.batiments.getAll();
        const batimentsList = Array.isArray(batimentsResponse.data.data)
          ? batimentsResponse.data.data
          : batimentsResponse.data || [];

        setAvailableBatiments(batimentsList);

        // Si un bâtiment est spécifié dans l'URL, le sélectionner automatiquement
        if (currentBatimentId && batimentsList.length > 0) {
          console.log("🎯 Bâtiment spécifié dans l'URL:", currentBatimentId);

          // Trouver le bâtiment dans la liste
          const selectedBat = batimentsList.find(
            (b: any) => b.id.toString() === currentBatimentId
          );

          if (selectedBat) {
            setSelectedBatiment(selectedBat);
            console.log(
              "✅ Bâtiment auto-sélectionné:",
              selectedBat.nom_batiment
            );

            // Charger les pièces de ce bâtiment
            setLoadingMessage("Chargement des pièces...");
            const piecesResponse = await apiHelpers.pieces.getByBatiment(
              currentBatimentId
            );

            let piecesData = [];
            if (piecesResponse.data.success && piecesResponse.data.data) {
              piecesData = piecesResponse.data.data.pieces || [];
            } else if (Array.isArray(piecesResponse.data)) {
              piecesData = piecesResponse.data;
            } else if (piecesResponse.data.pieces) {
              piecesData = piecesResponse.data.pieces;
            }

            setRooms(piecesData);
            console.log(
              `✅ ${piecesData.length} pièces chargées automatiquement`
            );
          } else {
            console.warn(
              "⚠️ Bâtiment non trouvé dans la liste:",
              currentBatimentId
            );
            setRooms([]);
          }
        } else {
          // Pas de bâtiment spécifié, commencer avec une liste vide
          setRooms([]);
          console.log(
            "✅ Aucun bâtiment spécifié, en attente de sélection manuelle"
          );
        }

        setLoadingMessage(
          currentBatimentId
            ? "Bâtiment chargé depuis l'URL"
            : "Sélectionnez un bâtiment pour commencer l'audit"
        );
      } catch (err: any) {
        console.error("❌ Erreur de chargement:", err);
        // Set empty array on error to prevent map errors
        setRooms([]);

        let errorMessage = "Erreur lors du chargement des pièces";
        if (err.code === "ERR_NETWORK") {
          errorMessage =
            "Impossible de se connecter au serveur Laravel. Vérifiez que le serveur est démarré sur http://127.0.0.1:8000";
        } else if (err.response?.status === 500) {
          errorMessage =
            "Erreur serveur. Vérifiez la connexion à la base de données.";
        }

        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        console.log("🏁 Chargement terminé");
      }
    };

    loadData();
  }, []); // Exécuter seulement au montage du composant

  // ✅ Ajouter une pièce localement
  const addRoom = () => {
    // Utiliser un ID négatif pour les nouvelles pièces (pas encore sauvegardées)
    const newId = -Date.now(); // ID négatif unique basé sur timestamp
    const newRoom = {
      id: newId,
      name: `Nouvelle pièce ${Math.abs(newId).toString().slice(-3)}`,
      level: "RDC",
      manager: "",
      batiment_id: selectedBatiment?.id || null,
    };
    setRooms([...rooms, newRoom]);
    setEditingRoomId(newId);
  };

  // ✅ Supprimer une pièce
  const removeRoom = async (id: number) => {
    try {
      // Si c'est une nouvelle pièce (ID négatif), la supprimer localement seulement
      if (id < 0) {
        setRooms(rooms.filter((room) => room.id !== id));
        toast({
          title: "Succès",
          description: "Pièce supprimée !",
        });
        return;
      }

      // Sinon, supprimer de la base de données
      await apiHelpers.pieces.delete(id);
      setRooms(rooms.filter((room) => room.id !== id));
      toast({
        title: "Succès",
        description: "Pièce supprimée !",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  // ✅ Sauvegarder toutes les pièces
  const saveConfig = async () => {
    // Validation préalable
    if (!selectedBatiment) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un bâtiment avant de sauvegarder",
        variant: "destructive",
      });
      return;
    }

    if (rooms.length === 0) {
      toast({
        title: "Information",
        description: "Aucune pièce à sauvegarder",
      });
      return;
    }

    try {
      console.log("🔍 DEBUG saveConfig:");
      console.log("- selectedBatiment:", selectedBatiment);
      console.log("- rooms:", rooms);
      console.log("- rooms.length:", rooms.length);

      // Filtrer les pièces qui n'ont pas encore d'ID (nouvelles pièces)
      const newRooms = rooms.filter((room) => !room.id || room.id < 0);
      const existingRooms = rooms.filter((room) => room.id && room.id > 0);

      console.log("- newRooms:", newRooms);
      console.log("- existingRooms:", existingRooms);

      let createdCount = 0;
      let updatedCount = 0;
      let errors = [];

      // Créer les nouvelles pièces une par une
      for (const room of newRooms) {
        // Validation des données
        if (!room.name || room.name.trim() === "") {
          errors.push(`Pièce sans nom ignorée`);
          continue;
        }

        // Mapper les données frontend vers backend
        const roomData = {
          nom_piece: room.name.trim(),
          niveau: room.level || "0",
          responsable: room.manager?.trim() || "",
          batiment_id: selectedBatiment.id,
        };

        try {
          console.log("Création pièce:", roomData);
          console.log("selectedBatiment:", selectedBatiment);
          console.log("room original:", room);

          await apiHelpers.pieces.create(roomData);
          createdCount++;
        } catch (error: any) {
          console.error("Erreur création pièce:", error);
          console.error("Données envoyées (roomData):", roomData);
          console.error("Room original:", room);

          let errorMsg = `Erreur création "${room.name}"`;
          if (error.response?.data?.message) {
            errorMsg += `: ${error.response.data.message}`;
          }
          errors.push(errorMsg);
        }
      }

      // Mettre à jour les pièces existantes
      for (const room of existingRooms) {
        // Validation des données
        if (!room.name || room.name.trim() === "") {
          errors.push(`Pièce existante sans nom ignorée`);
          continue;
        }

        // Mapper les données frontend vers backend
        const roomData = {
          nom_piece: room.name.trim(),
          niveau: room.level || "0",
          responsable: room.manager?.trim() || "",
          batiment_id: selectedBatiment.id,
        };

        try {
          console.log("Mise à jour pièce:", roomData);
          console.log("selectedBatiment:", selectedBatiment);
          console.log("room original:", room);

          await apiHelpers.pieces.update(room.id, roomData);
          updatedCount++;
        } catch (error: any) {
          console.error("Erreur mise à jour pièce:", error);
          console.error("Données envoyées (roomData):", roomData);
          console.error("Room original:", room);

          let errorMsg = `Erreur mise à jour "${room.name}"`;
          if (error.response?.data?.message) {
            errorMsg += `: ${error.response.data.message}`;
          }
          errors.push(errorMsg);
        }
      }

      // Recharger les données du bâtiment sélectionné
      try {
        const response = await apiHelpers.pieces.getByBatiment(
          selectedBatiment.id.toString()
        );
        let piecesData = [];
        if (response.data.success && response.data.data) {
          piecesData = response.data.data.pieces || [];
        } else if (Array.isArray(response.data)) {
          piecesData = response.data;
        }
        setRooms(piecesData);
      } catch (reloadError) {
        console.error("Erreur rechargement:", reloadError);
        // Ne pas bloquer si le rechargement échoue
      }

      // Afficher le résultat
      if (errors.length > 0) {
        toast({
          title: "Sauvegarde partielle",
          description: `${createdCount} créée(s), ${updatedCount} mise(s) à jour. ${errors.length} erreur(s).`,
          variant: "destructive",
        });
        console.log("Erreurs détaillées:", errors);
      } else {
        toast({
          title: "Succès",
          description: `Configuration enregistrée ! ${createdCount} nouvelle(s) pièce(s) créée(s), ${updatedCount} pièce(s) mise(s) à jour.`,
        });
      }
    } catch (err: any) {
      console.error("Erreur générale:", err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: number) => {
    setEditingRoomId(id);
  };

  const handleSave = async (id: number) => {
    const room = rooms.find((r) => r.id === id);
    if (!room) return;

    // Validation préalable
    if (!room.name || room.name.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le nom de la pièce est obligatoire",
        variant: "destructive",
      });
      return;
    }

    if (!selectedBatiment) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un bâtiment",
        variant: "destructive",
      });
      return;
    }

    // Mapper les données frontend vers backend
    const roomData = {
      nom_piece: room.name.trim(),
      niveau: room.level || "0",
      responsable: room.manager?.trim() || "",
      batiment_id: selectedBatiment.id,
    };

    console.log("Debug handleSave:");
    console.log("- room:", room);
    console.log("- selectedBatiment:", selectedBatiment);
    console.log("- roomData:", roomData);

    try {
      console.log("Sauvegarde pièce:", roomData);

      if (id < 0) {
        // Nouvelle pièce - créer
        const response = await apiHelpers.pieces.create(roomData);
        // Mettre à jour l'ID local avec l'ID de la base de données
        const newId = response.data?.id || Math.floor(Math.random() * 1000000);
        setRooms(rooms.map((r) => (r.id === id ? { ...r, id: newId } : r)));

        toast({
          title: "Succès",
          description: "Nouvelle pièce créée !",
        });
      } else {
        // Pièce existante - mettre à jour
        await apiHelpers.pieces.update(id, roomData);

        toast({
          title: "Succès",
          description: "Pièce mise à jour !",
        });
      }

      setEditingRoomId(null);
    } catch (err: any) {
      console.error("Erreur sauvegarde:", err);
      console.error("Données envoyées:", roomData);

      let errorMessage = "Erreur lors de la sauvegarde";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 422) {
        errorMessage = "Données invalides. Vérifiez les champs obligatoires.";
      } else if (err.response?.status === 500) {
        errorMessage =
          "Erreur serveur. Vérifiez la connexion à la base de données.";
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRoomChange = (
    id: number,
    field: keyof Omit<Room, "id">,
    value: string
  ) => {
    setRooms(
      rooms.map((room) => (room.id === id ? { ...room, [field]: value } : room))
    );
  };

  const isEditing = (id: number) => editingRoomId === id;

  // Fonction pour changer de bâtiment
  const handleBatimentChange = async (batimentId: string) => {
    if (!batimentId) {
      setSelectedBatiment(null);
      setBatimentId(null);
      setRooms([]);
      return;
    }

    // Trouver le bâtiment sélectionné dans la liste (déplacer hors du try block)
    const selectedBat = availableBatiments.find(
      (b) => b.id.toString() === batimentId
    );

    try {
      setLoading(true);

      if (!selectedBat) {
        toast({
          title: "Erreur",
          description: "Bâtiment non trouvé dans la liste",
          variant: "destructive",
        });
        return;
      }

      setSelectedBatiment(selectedBat);
      console.log("Bâtiment sélectionné:", selectedBat);
      console.log("Nom du bâtiment:", selectedBat.nom_batiment);

      // Charger les pièces du bâtiment
      console.log(
        "Tentative de chargement des pièces pour le bâtiment ID:",
        batimentId
      );

      const response = await apiHelpers.pieces.getByBatiment(batimentId);
      console.log("Réponse API pièces:", response.data); // Debug

      // Handle response from batiment pieces API or regular pieces API
      let piecesData = [];
      if (response.data.success && response.data.data) {
        // Structure avec success
        piecesData = response.data.data.pieces || [];
        if (response.data.data.batiment) {
          setSelectedBatiment(response.data.data.batiment);
        }

        // Plus besoin de récupérer un audit
        console.log("✅ Pièces chargées pour le bâtiment");
      } else if (Array.isArray(response.data)) {
        // Structure directe (array)
        piecesData = response.data;
        console.log("⚠️ Réponse en format array, pas d'audit disponible");
      } else if (response.data.pieces) {
        // Structure avec pieces
        piecesData = response.data.pieces;
        console.log("⚠️ Réponse avec pieces, pas d'audit disponible");
      }

      setRooms(piecesData);
      setBatimentId(batimentId);

      console.log("🎯 Pièces définies dans l'état:", piecesData);
      console.log("🎯 Nombre de pièces:", piecesData.length);

      // Mettre à jour l'URL sans recharger la page
      const url = new URL(window.location.href);
      url.searchParams.set("batiment_id", batimentId);
      window.history.pushState({}, "", url.toString());

      toast({
        title: "Succès",
        description: `Bâtiment sélectionné : ${
          selectedBat?.nom_batiment || "Bâtiment"
        }`,
      });
    } catch (error: any) {
      console.error("Erreur lors du changement de bâtiment:", error);
      console.error("Status:", error.response?.status);
      console.error("URL:", error.config?.url);

      let errorMessage = "Erreur lors du chargement du bâtiment";
      if (error.response?.status === 404) {
        errorMessage =
          "Route ou bâtiment non trouvé. Vérifiez que le serveur Laravel est démarré.";

        // Fallback: essayer de charger toutes les pièces et filtrer
        try {
          console.log("Tentative de fallback...");
          const allPiecesResponse = await apiHelpers.pieces.getAll();
          const allPieces = Array.isArray(allPiecesResponse.data)
            ? allPiecesResponse.data
            : [];
          const filteredPieces = allPieces.filter(
            (piece) =>
              piece.batiment_id && piece.batiment_id.toString() === batimentId
          );

          setRooms(filteredPieces);
          setBatimentId(batimentId);

          toast({
            title: "Succès (mode fallback)",
            description: `Bâtiment sélectionné : ${
              selectedBat?.nom_batiment || "Bâtiment"
            }`,
          });
          return; // Sortir de la fonction si le fallback fonctionne
        } catch (fallbackError) {
          console.error("Fallback échoué:", fallbackError);
        }
      } else if (error.response?.status === 500) {
        errorMessage = "Erreur serveur";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Impossible de se connecter au serveur";
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage text={loadingMessage} />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration du Bâtiment</CardTitle>
          <CardDescription>
            {selectedBatiment
              ? `Audit des pièces du bâtiment: ${selectedBatiment.nom_batiment}`
              : "Informations de base pour cet audit."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Date de l'audit</Label>
              <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(date, "PPP", { locale: fr })}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  (Automatique)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="building-select">Nom du bâtiment</Label>
              <Select
                value={selectedBatiment?.id?.toString() || ""}
                onValueChange={handleBatimentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bâtiment" />
                </SelectTrigger>
                <SelectContent>
                  {availableBatiments.map((batiment) => (
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

            <div className="space-y-2">
              <Label htmlFor="levels">Nombre de niveaux</Label>
              <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                <span className="text-sm">
                  {selectedBatiment?.nombre_etages || "N/A"}
                </span>
                {selectedBatiment?.nombre_etages && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    étage{selectedBatiment.nombre_etages > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!selectedBatiment && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>Astuce:</strong> Sélectionnez un bâtiment dans la
                liste ci-dessus pour commencer l'audit de ses pièces.
              </p>
            </div>
          )}

          {selectedBatiment && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800">
                    ✅ <strong>Bâtiment sélectionné:</strong>{" "}
                    {selectedBatiment.nom_batiment} ({selectedBatiment.commune})
                  </p>
                </div>
                <span className="text-xs text-green-600">
                  {rooms.length} pièce{rooms.length > 1 ? "s" : ""} trouvée
                  {rooms.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table des pièces */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ajout des Pièces</CardTitle>
              <CardDescription>
                {selectedBatiment 
                  ? "Renseignez les informations pour chaque pièce auditée."
                  : "⚠️ Veuillez d'abord sélectionner un bâtiment pour ajouter des pièces."}
              </CardDescription>
            </div>
            <Button 
              onClick={addRoom}
              disabled={!selectedBatiment}
              className={!selectedBatiment ? "opacity-50 cursor-not-allowed" : ""}
              title={!selectedBatiment ? "Sélectionnez d'abord un bâtiment" : "Ajouter une nouvelle pièce"}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une pièce
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">Nom de la pièce</TableHead>
                <TableHead className="w-[25%]">Niveau</TableHead>
                <TableHead className="w-[30%]">Nom du responsable</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.isArray(rooms) &&
                rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      {isEditing(room.id) ? (
                        <Input
                          value={room.name}
                          onChange={(e) =>
                            handleRoomChange(room.id, "name", e.target.value)
                          }
                          className="h-8"
                        />
                      ) : (
                        <span
                          className={
                            room.id < 0 ? "text-orange-600 font-medium" : ""
                          }
                        >
                          {room.name}
                          {room.id < 0 && (
                            <span className="text-xs ml-2 text-orange-500">
                              (non sauvegardée)
                            </span>
                          )}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {isEditing(room.id) ? (
                        <Select
                          value={room.level}
                          onValueChange={(value) =>
                            handleRoomChange(room.id, "level", value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedBatiment?.niveaux_disponibles
                              ? selectedBatiment.niveaux_disponibles.map(
                                  (niveau: string, index: number) => (
                                    <SelectItem
                                      key={index}
                                      value={index.toString()}
                                    >
                                      {niveau}
                                    </SelectItem>
                                  )
                                )
                              : levels.map((level) => (
                                  <SelectItem
                                    key={level.value}
                                    value={level.value}
                                  >
                                    {level.label}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span>
                          {selectedBatiment?.niveaux_disponibles
                            ? selectedBatiment.niveaux_disponibles[
                                parseInt(room.level)
                              ] || room.level
                            : levels.find((l) => l.value === room.level)?.label}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {isEditing(room.id) ? (
                        <Input
                          value={room.manager}
                          onChange={(e) =>
                            handleRoomChange(room.id, "manager", e.target.value)
                          }
                          className="h-8"
                        />
                      ) : (
                        <span>{room.manager}</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      {isEditing(room.id) ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSave(room.id)}
                        >
                          <Save className="h-4 w-4 text-primary" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(room.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRoom(room.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
