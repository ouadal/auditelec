import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Save, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ElectricalPage() {
    const panelImage = PlaceHolderImages.find(p => p.id === 'electrical-panel');
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration du Compteur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wires">Nombre de fils</Label>
              <Select>
                <SelectTrigger id="wires">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 fils</SelectItem>
                  <SelectItem value="4">4 fils</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amperage">Ampérage</Label>
              <Select>
                <SelectTrigger id="amperage">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((amp) => (
                    <SelectItem key={amp} value={String(amp)}>
                      {amp} A
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Coffret Électrique</CardTitle>
             <CardDescription>Composants et photo du coffret principal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="components">Composants du coffret</Label>
                <Textarea id="components" placeholder="Lister les composants : disjoncteurs, interrupteurs différentiels, etc." />
             </div>
             <div className="space-y-2">
                <Label>Photo du coffret</Label>
                <div className="flex items-center gap-4">
                    <div className="w-1/2 h-32 rounded-md border border-dashed flex items-center justify-center bg-muted">
                        {panelImage ? (
                            <Image 
                                src={panelImage.imageUrl} 
                                alt={panelImage.description} 
                                data-ai-hint={panelImage.imageHint}
                                width={150}
                                height={100}
                                className="object-cover rounded-md"
                            />
                        ) : (
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        )}
                    </div>
                    <Button variant="outline" asChild>
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" /> Importer
                        <input type="file" id="photo-upload" className="sr-only" />
                      </label>
                    </Button>
                </div>
             </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Câbles Électriques</CardTitle>
            <CardDescription>Détails sur les câbles utilisés.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="cable-type">Type de câble principal</Label>
                <Input id="cable-type" placeholder="ex: Câble armé 4x25mm²" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="cable-condition">État général du câblage</Label>
                <Select>
                    <SelectTrigger id="cable-condition">
                      <SelectValue placeholder="Évaluer l'état..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Bon</SelectItem>
                      <SelectItem value="average">Moyen</SelectItem>
                      <SelectItem value="bad">Mauvais</SelectItem>
                    </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer l'Installation
        </Button>
      </div>
    </div>
  );
}
