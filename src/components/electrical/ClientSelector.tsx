"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Building, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { clientService } from "../../../services/electricalApi";

interface Client {
  id: number;
  contact_nom: string;
  contact_fonction?: string;
  contact_email: string;
  nom_entreprise?: string;
  ville?: string;
}

interface ClientSelectorProps {
  selectedClientId: number | null;
  onClientSelect: (clientId: number | null) => void;
  onRefresh?: () => void;
}

export function ClientSelector({ selectedClientId, onClientSelect, onRefresh }: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Chargement des clients...");
      const response = await clientService.getAll();
      console.log("✅ Réponse API clients:", response);
      
      const clientsData = response.data || [];
      console.log("📊 Nombre de clients trouvés:", clientsData.length);
      setClients(clientsData);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des clients:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      setError("Impossible de charger les clients");
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

  const selectedClient = clients.find(client => client.id === selectedClientId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Sélection du Client</CardTitle>
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
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
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
              <Label>Client :</Label>
              <Select
                value={selectedClientId ? selectedClientId.toString() : "all"}
                onValueChange={handleClientChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un client"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Tous les clients
                    </div>
                  </SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span className="font-medium">{client.contact_nom}</span>
                        </div>
                        {client.nom_entreprise && (
                          <span className="text-sm text-gray-500 ml-6">
                            {client.nom_entreprise}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Informations du client sélectionné */}
            {selectedClient && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Client sélectionné</span>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Nom:</span> {selectedClient.contact_nom}</p>
                  {selectedClient.contact_fonction && (
                    <p><span className="font-medium">Fonction:</span> {selectedClient.contact_fonction}</p>
                  )}
                  {selectedClient.nom_entreprise && (
                    <p><span className="font-medium">Entreprise:</span> {selectedClient.nom_entreprise}</p>
                  )}
                  <p><span className="font-medium">Email:</span> {selectedClient.contact_email}</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" text="Chargement des clients..." />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}