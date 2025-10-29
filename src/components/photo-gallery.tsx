'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PhotoGalleryProps {
  photos: string[];
  onDeletePhoto: (index: number) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onDeletePhoto
}) => {
  if (photos.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">Photos capturées</h3>
      <ScrollArea className="h-[200px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <Image
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDeletePhoto(index)}
              >
                Supprimer
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};