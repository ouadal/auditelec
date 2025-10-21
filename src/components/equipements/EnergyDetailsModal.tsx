"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Eye, Zap, Euro } from "lucide-react";

interface EnergyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  resumePiece: any;
  resumeBatiment: any;
}

export function EnergyDetailsModal({
  isOpen,
  onClose,
  loading,
  resumePiece,
  resumeBatiment,
}: EnergyDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Détails Énergétiques
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pièce - Avec sommes des énergies */}
            {resumePiece && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">
                  📍 {resumePiece.nom_piece}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Consommation/jour:</span>
                    <span className="font-bold">
                      {resumePiece.energie_totale_jour_kWh.toFixed(1)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consommation/mois:</span>
                    <span className="font-bold">
                      {resumePiece.energie_totale_mensuelle_kWh.toFixed(0)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consommation/an:</span>
                    <span className="font-bold">
                      {resumePiece.energie_totale_annuelle_kWh.toFixed(0)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Coût annuel:</span>
                    <span className="font-bold text-green-600">
                      {Math.round(resumePiece.energie_totale_annuelle_kWh * 100).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bâtiment - Avec sommes des énergies */}
            {resumeBatiment && (
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-3">
                  🏢 {resumeBatiment.nom_batiment}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total équipements:</span>
                    <span className="font-bold">{resumeBatiment.nombre_equipements}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consommation/jour:</span>
                    <span className="font-bold">
                      {resumeBatiment.energie_totale_jour_kWh.toFixed(1)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consommation/mois:</span>
                    <span className="font-bold">
                      {resumeBatiment.energie_totale_mensuelle_kWh.toFixed(0)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consommation/an:</span>
                    <span className="font-bold">
                      {resumeBatiment.energie_totale_annuelle_kWh.toFixed(0)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Coût total annuel:</span>
                    <span className="font-bold text-green-600">
                      {resumeBatiment.cout_annuel_estime_fcfa.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}