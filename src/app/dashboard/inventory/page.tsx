'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Save, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

interface Equipment {
  id: number;
  type: string;
  name: string;
  quantity: number;
  powerCalcMethod: 'current' | 'energy';
  powerValue: number;
}

export default function InventoryPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([
    { id: 1, type: 'Climatiseur', name: 'Split LG 12000 BTU', quantity: 4, powerCalcMethod: 'current', powerValue: 5.5 },
    { id: 2, type: 'Ordinateur', name: 'PC de bureau Dell', quantity: 15, powerCalcMethod: 'energy', powerValue: 300 },
  ]);

  const addEquipment = () => {
    const newId = equipments.length > 0 ? Math.max(...equipments.map(e => e.id)) + 1 : 1;
    setEquipments([...equipments, { id: newId, type: '', name: '', quantity: 1, powerCalcMethod: 'current', powerValue: 0 }]);
  };

  const removeEquipment = (id: number) => {
    setEquipments(equipments.filter(e => e.id !== id));
  };
  
  const equipmentImage = PlaceHolderImages.find(p => p.id === 'equipment-photo');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventaire des Équipements</CardTitle>
              <CardDescription>Ajoutez et configurez chaque équipement du site.</CardDescription>
            </div>
            <Button onClick={addEquipment}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un équipement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Photo</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead className="w-[300px]">Calcul Puissance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipments.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><Input defaultValue={item.type} placeholder="ex: Éclairage" /></TableCell>
                    <TableCell><Input defaultValue={item.name} placeholder="ex: Plafonnier LED" /></TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon" asChild>
                        <label htmlFor={`photo-${item.id}`} className="cursor-pointer">
                          <ImageIcon className="h-4 w-4" />
                           <input type="file" id={`photo-${item.id}`} className="sr-only" />
                        </label>
                      </Button>
                    </TableCell>
                    <TableCell><Input type="number" defaultValue={item.quantity} className="w-20" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <RadioGroup defaultValue={item.powerCalcMethod} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="current" id={`current-${item.id}`} />
                            <Label htmlFor={`current-${item.id}`} className="text-xs">Courant (A)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="energy" id={`energy-${item.id}`} />
                            <Label htmlFor={`energy-${item.id}`} className="text-xs">Énergie (kWh/an)</Label>
                          </div>
                        </RadioGroup>
                        <Input type="number" defaultValue={item.powerValue} className="w-24" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeEquipment(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer l'Inventaire
        </Button>
      </div>
    </div>
  );
}
