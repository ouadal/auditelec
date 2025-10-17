"use client";

import { Modal } from "@/components/ui/modal";
import { Installation } from "@/types/electrical";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  installation: Installation | null;
  onPhotoClick: (photoUrl: string) => void;
}

export function PhotoModal({ isOpen, onClose, installation, onPhotoClick }: PhotoModalProps) {
  if (!installation) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Photos de l'installation"
      size="xl"
    >
      <div className="p-6">
        <div className="space-y-6">
          {/* Photos du coffret */}
          {installation.photo_coffret?.length && installation.photo_coffret.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">📦 Coffret électrique</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {installation.photo_coffret?.map((photo, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={`http://127.0.0.1:8000/storage/${photo}`}
                      alt={`Coffret ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onPhotoClick(`http://127.0.0.1:8000/storage/${photo}`)}
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNTAiIHk9IjY0IiBmaWxsPSIjOUI5QkEwIj5Db2ZmcmV0PC90ZXh0Pjwvc3ZnPg==";
                      }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Commentaire coffret */}
              {installation.composantes_coffret && (
                <div className="mt-4 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-medium text-blue-800 mb-1">💬 Composantes</h4>
                  <p className="text-blue-700 text-sm">{installation.composantes_coffret}</p>
                </div>
              )}
            </div>
          )}

          {/* Photos des câbles électriques */}
          {installation.photo_cable_electrique?.length && installation.photo_cable_electrique.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">🔌 Câbles électriques</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {installation.photo_cable_electrique?.map((photo, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={`http://127.0.0.1:8000/storage/${photo}`}
                      alt={`Câble électrique ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onPhotoClick(`http://127.0.0.1:8000/storage/${photo}`)}
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNTAiIHk9IjY0IiBmaWxsPSIjOUI5QkEwIj5Dw6JibGU8L3RleHQ+PC9zdmc+";
                      }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Commentaire câbles */}
              {installation.commentaire_cable && (
                <div className="mt-4 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-medium text-green-800 mb-1">💬 Commentaire câblage</h4>
                  <p className="text-green-700 text-sm">{installation.commentaire_cable}</p>
                </div>
              )}
            </div>
          )}

          {/* Photos du type de câble */}
          {installation.photo_type_cable?.length && installation.photo_type_cable.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">🏷️ Type de câble</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {installation.photo_type_cable?.map((photo, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={`http://127.0.0.1:8000/storage/${photo}`}
                      alt={`Type câble ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onPhotoClick(`http://127.0.0.1:8000/storage/${photo}`)}
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNDAiIHk9IjY0IiBmaWxsPSIjOUI5QkEwIj5UeXBlIGPDomJsZTwvdGV4dD48L3N2Zz4=";
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
          {installation.photo_barette_coupure?.length && installation.photo_barette_coupure.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">🔧 Barette de coupure</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {installation.photo_barette_coupure?.map((photo, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={`http://127.0.0.1:8000/storage/${photo}`}
                      alt={`Barette ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onPhotoClick(`http://127.0.0.1:8000/storage/${photo}`)}
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNDAiIHk9IjY0IiBmaWxsPSIjOUI5QkEwIj5CYXJldHRlPC90ZXh0Pjwvc3ZnPg==";
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
          {installation.photo_terre_pc?.length && installation.photo_terre_pc.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">🌍 Terre PC</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {installation.photo_terre_pc?.map((photo, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={`http://127.0.0.1:8000/storage/${photo}`}
                      alt={`Terre PC ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onPhotoClick(`http://127.0.0.1:8000/storage/${photo}`)}
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNjAiIHk9IjY0IiBmaWxsPSIjOUI5QkEwIj5UZXJyZTwvdGV4dD48L3N2Zz4=";
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
                  <h4 className="font-medium text-teal-800 mb-1">⚡ Valeur de terre</h4>
                  <p className="text-teal-700 text-sm">{installation.valeur_terre}Ω</p>
                </div>
              )}
            </div>
          )}

          {/* Message si aucune photo */}
          {!installation.photo_coffret?.length &&
           !installation.photo_cable_electrique?.length &&
           !installation.photo_type_cable?.length &&
           !installation.photo_barette_coupure?.length &&
           !installation.photo_terre_pc?.length && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">📷</div>
              <p className="text-gray-500">
                Aucune photo disponible pour cette installation
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}