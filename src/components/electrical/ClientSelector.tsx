"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Building, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { clientService } from "../../../services/electricalApi";

interface Client {
  id: number;
  contact_nom: string;
  contact_fonction?: string;
  contact_email: string;
  nom_entreprise?: string;
}

interface Statistics {
  totalInstallations: number;
  totalPrises: number;
  totalInterrupteurs: number;
}

interface ClientSelectorProps {
  selectedClientId: number | null;
  onClientSelect: (clientId: number | null) => void;
  onRefresh?: () => void;
}

export function ClientSelector({
  selectedClientId,
  onClientSelect,
  onRefresh,
}: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Chargement des projets...");
      const response = await clientService.getAll();
      const clientsData = Array.isArray((response as any)?.data)
        ? (response as any).data
        : Array.isArray(response)
        ? (response as any)
        : ((response as any)?.data ?? []);
      console.log("✅ Projets chargés:", clientsData.length);
      setClients(clientsData);
    } catch (error) {
      const axiosError = error as any;
      const status = axiosError?.response?.status;
      const respData = axiosError?.response?.data;
      console.warn("⚠️ Impossible de charger les projets", {
        status,
        data: respData,
      });
      let message = "Impossible de charger les projets";
      if (!axiosError?.response) {
        message = "API indisponible. Vérifiez le backend sur http://localhost:8000.";
      } else if (typeof respData === "object" && respData?.message) {
        message = respData.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleClientChange = (value: string) => {
    if (value === "all") {
      onClientSelect(null);
    } else {
      onClientSelect(parseInt(value));
    }
  };

  const selectedClient = clients.find(
    (client) => client.id === selectedClientId
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Sélection du Projet</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadClients();
              onRefresh?.();
            }}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="text-center py-4">
            <p className="text-red-600 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={loadClients}>
              Réessayer
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label>Projet :</Label>
              <Select
                value={selectedClientId ? selectedClientId.toString() : "all"}
                onValueChange={handleClientChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loading ? "Chargement..." : "Sélectionner un projet"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Tous les projets
                    </div>
                  </SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">
                          {client.nom_entreprise || client.contact_nom}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Informations du projet sélectionné */}
            {selectedClient && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {selectedClient.nom_entreprise || selectedClient.contact_nom}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Nom:</span>{" "}
                    {selectedClient.contact_nom}
                  </p>
                  {selectedClient.contact_fonction && (
                    <p>
                      <span className="font-medium">Fonction:</span>{" "}
                      {selectedClient.contact_fonction}
                    </p>
                  )}
                  {selectedClient.nom_entreprise && (
                    <p>
                      <span className="font-medium">Entreprise:</span>{" "}
                      {selectedClient.nom_entreprise}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedClient.contact_email}
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" text="Chargement des projets..." />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
