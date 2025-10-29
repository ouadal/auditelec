"use client";

import { Modal } from "@/components/ui/modal";
import { Installation } from "@/types/electrical";
import { resolvePhotoUrl } from "@/lib/photoUrl";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  installation: Installation | null;
  onPhotoClick: (photoUrl: string) => void;
}

export function PhotoModal({ isOpen, onClose, installation, onPhotoClick }: PhotoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="space-y-8 p-6">
        <h2 className="text-2xl font-semibold">Photos de l'installation</h2>

        {/* Photos du coffret */}
        {installation && installation.photo_coffret?.length && installation.photo_coffret.length > 0 && (
          <div>
            <h3 className="font-semibold text-blue-800 mb-3">📸 Photos du coffret</h3>
            <div className="grid grid-cols-2 gap-4">
              {installation.photo_coffret.map((photo, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={resolvePhotoUrl(photo)}
                    alt={`Coffret ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onPhotoClick(resolvePhotoUrl(photo))}
                    onError={(e) => {
                      e.currentTarget.src = "/images/fallback/coffret.png";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos des câbles */}
        {installation && installation.photo_cable_electrique?.length && installation.photo_cable_electrique.length > 0 && (
          <div>
            <h3 className="font-semibold text-indigo-800 mb-3">📸 Photos des câbles</h3>
            <div className="grid grid-cols-2 gap-4">
              {installation.photo_cable_electrique.map((photo, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={resolvePhotoUrl(photo)}
                    alt={`Câble ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onPhotoClick(resolvePhotoUrl(photo))}
                    onError={(e) => {
                      e.currentTarget.src = "/images/fallback/cable.png";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos du type de câble */}
        {installation && installation.photo_type_cable?.length && installation.photo_type_cable.length > 0 && (
          <div>
            <h3 className="font-semibold text-purple-800 mb-3">📸 Photos du type de câble</h3>
            <div className="grid grid-cols-2 gap-4">
              {installation.photo_type_cable.map((photo, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={resolvePhotoUrl(photo)}
                    alt={`Type câble ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onPhotoClick(resolvePhotoUrl(photo))}
                    onError={(e) => {
                      e.currentTarget.src = "/images/fallback/cable-type.png";
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Info type de câble */}
            {installation.cable_type && (
              <div className="mt-4 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-medium text-purple-800 mb-1">💬 Type de câble</h4>
                <p className="text-purple-700 text-sm">{installation.cable_type}</p>
              </div>
            )}
          </div>
        )}

        {/* Photos de la barette de coupure */}
        {installation && installation.photo_barette_coupure?.length && installation.photo_barette_coupure.length > 0 && (
          <div>
            <h3 className="font-semibold text-orange-800 mb-3">📸 Photos de la barette de coupure</h3>
            <div className="grid grid-cols-2 gap-4">
              {installation.photo_barette_coupure.map((photo, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={resolvePhotoUrl(photo)}
                    alt={`Barette ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onPhotoClick(resolvePhotoUrl(photo))}
                    onError={(e) => {
                      e.currentTarget.src = "/images/fallback/barette.png";
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Info barette de coupure */}
            <div className="mt-4 bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
              <h4 className="font-medium text-orange-800 mb-1">💬 Barette de coupure</h4>
              <p className="text-orange-700 text-sm">
                {installation.barette_de_coupure ? "Présente" : "Absente"}
              </p>
            </div>
          </div>
        )}

        {/* Photos de la terre PC */}
        {installation && installation.photo_terre_pc?.length && installation.photo_terre_pc.length > 0 && (
          <div>
            <h3 className="font-semibold text-emerald-800 mb-3">📸 Photos de la terre PC</h3>
            <div className="grid grid-cols-2 gap-4">
              {installation.photo_terre_pc.map((photo, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={resolvePhotoUrl(photo)}
                    alt={`Terre PC ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onPhotoClick(resolvePhotoUrl(photo))}
                    onError={(e) => {
                      e.currentTarget.src = "/images/fallback/terre.png";
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Commentaire terre PC */}
            {installation.commentaire_terre && (
              <div className="mt-4 bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-400">
                <h4 className="font-medium text-emerald-800 mb-1">💬 Commentaire terre</h4>
                <p className="text-emerald-700 text-sm">{installation.commentaire_terre}</p>
              </div>
            )}
            
            {/* Info valeur terre */}
            {installation.valeur_terre && (
              <div className="mt-2 bg-teal-50 p-3 rounded-lg border-l-4 border-teal-400">
                <h4 className="font-medium text-teal-800 mb-1">📊 Valeur terre</h4>
                <p className="text-teal-700 text-sm">{installation.valeur_terre} Ω</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}