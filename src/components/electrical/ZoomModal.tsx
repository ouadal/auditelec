"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ZoomModalProps {
  photoUrl: string | null;
  onClose: () => void;
}

export function ZoomModal({ photoUrl, onClose }: ZoomModalProps) {
  if (!photoUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div className="relative max-w-[50vw] max-h-[50vh]">
        <img
          src={photoUrl}
          alt="Photo agrandie"
          className="w-full h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        <Button
          variant="secondary"
          size="sm"
          className="absolute -top-2 -right-2 bg-white/90 hover:bg-white rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}