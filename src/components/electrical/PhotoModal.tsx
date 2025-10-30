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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold mb-6">Photos de l'installation</h2>

        {/* Photos du coffret */}
        {installation && installation.photo_coffret?.length && installation.photo_coffret.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-800">📸 Photos du coffret</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {installation.photo_coffret.map((photo, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img
                    src={resolvePhotoUrl(photo)}
                    alt={`Coffret ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => onPhotoClick(resolvePhotoUrl(photo))}
                    onError={(e) => {
                      e.currentTarget.src = "/images/fallback/coffret.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos des câbles */}
        {installation && installation.photo_cable_electrique?.length && installation.photo_cable_electrique.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-indigo-800">📸 Photos des câbles</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {installation.photo_cable_electrique.map((photo, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img
                    src={resolvePhotoUrl(photo)}
                    alt={`Câble ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => onPhotoClick(resolvePhotoUrl(photo))}
                    onError={(e) => {
                      e.currentTarget.src = "/images/fallback/cable.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos du type de câble */}
        {installation && installation.photo_type_cable?.length && installation.photo_type_cable.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-purple-800">📸 Photos du type de câble</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {installation.photo_type_cable.map((photo, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img
                    src={resolvePhotoUrl(photo)}
                    alt={`Type câble ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => onPhotoClick(resolvePhotoUrl(photo))}
                    onError={(e) => {
                      e.currentTarget.src = "/images/fallback/cable-type.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-lg" />
                </div>
              ))}
            </div>
            
            {/* Info type de câble */}
            {installation.cable_type && (
              <div className="mt-4 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-medium text-purple-800 mb-2">💬 Type de câble</h4>
                <p className="text-purple-700">{installation.cable_type}</p>
              </div>
            )}
          </div>
        )}

        {/* Photos de la barette de coupure */}
        {installation && installation.photo_barette_coupure?.length && installation.photo_barette_coupure.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-orange-800">📸 Photos de la barette de coupure</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {installation.photo_barette_coupure.map((photo, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img
                    src={resolvePhotoUrl(photo)}
                    alt={`Barette ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => onPhotoClick(resolvePhotoUrl(photo))}
                    onError={(e) => {
                      e.currentTarget.src = "/images/fallback/barette.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-lg" />
                </div>
              ))}
            </div>
            
            {/* Info barette de coupure */}
            <div className="mt-4 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <h4 className="font-medium text-orange-800 mb-2">💬 Barette de coupure</h4>
              <p className="text-orange-700">
                {installation.barette_de_coupure ? "Présente" : "Absente"}
              </p>
            </div>
          </div>
        )}

        {/* Photos de la terre PC */}
        {installation && installation.photo_terre_pc?.length && installation.photo_terre_pc.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-800">📸 Photos de la terre PC</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {installation.photo_terre_pc.map((photo, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img
                    src={resolvePhotoUrl(photo)}
                    alt={`Terre PC ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => onPhotoClick(resolvePhotoUrl(photo))}
                    onError={(e) => {
                      e.currentTarget.src = "/images/fallback/terre.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-lg" />
                </div>
              ))}
            </div>
            
            {/* Commentaire terre PC */}
            {installation.commentaire_terre && (
              <div className="mt-4 bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-400">
                <h4 className="font-medium text-emerald-800 mb-2">💬 Commentaire terre</h4>
                <p className="text-emerald-700">{installation.commentaire_terre}</p>
              </div>
            )}
            
            {/* Info valeur terre */}
            {installation.valeur_terre && (
              <div className="mt-4 bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
                <h4 className="font-medium text-teal-800 mb-2">📊 Valeur terre</h4>
                <p className="text-teal-700">{installation.valeur_terre} Ω</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}