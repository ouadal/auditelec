'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Save, Trash2, Upload, Image as ImageIcon, Pencil } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

interface Equipment {
  id: number;
  type: string;
  name: string;
  quantity: number;
  powerCalcMethod: 'power' | 'current' | 'energy';
  powerValue: number;
}

export default function InventoryPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([
    { id: 1, type: 'Climatiseur', name: 'Split LG 12000 BTU', quantity: 4, powerCalcMethod: 'power', powerValue: 1200 },
    { id: 2, type: 'Ordinateur', name: 'PC de bureau Dell', quantity: 15, powerCalcMethod: 'power', powerValue: 300 },
  ]);

  const [editingEquipmentId, setEditingEquipmentId] = useState<number | null>(null);

  const addEquipment = () => {
    const newId = equipments.length > 0 ? Math.max(...equipments.map(e => e.id)) + 1 : 1;
    const newEquipment = { 
      id: newId, 
      type: '', 
      name: '', 
      quantity: 1, 
      powerCalcMethod: 'power' as 'power' | 'current' | 'energy', 
      powerValue: 0 
    };
    setEquipments([...equipments, newEquipment]);
    setEditingEquipmentId(newId);
  };

  const removeEquipment = (id: number) => {
    setEquipments(equipments.filter(e => e.id !== id));
  };

  const handleEdit = (id: number) => {
    setEditingEquipmentId(id);
  };

  const handleSave = (id: number) => {
    setEditingEquipmentId(null);
  };

  const handleEquipmentChange = (id: number, field: keyof Omit<Equipment, 'id'>, value: string | number) => {
    setEquipments(equipments.map(eq => eq.id === id ? { ...eq, [field]: value } : eq));
  };

  const isEditing = (id: number) => editingEquipmentId === id;

  const getUnit = (method: 'power' | 'current' | 'energy') => {
    switch (method) {
      case 'power': return 'W';
      case 'current': return 'A';
      case 'energy': return 'kWh/an';
    }
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
                  <TableHead className="w-[350px]">Calcul Puissance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipments.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {isEditing(item.id) ? (
                        <Input 
                          value={item.type} 
                          onChange={(e) => handleEquipmentChange(item.id, 'type', e.target.value)} 
                          placeholder="ex: Éclairage" 
                        />
                      ) : (
                        <span>{item.type}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing(item.id) ? (
                        <Input 
                          value={item.name} 
                          onChange={(e) => handleEquipmentChange(item.id, 'name', e.target.value)} 
                          placeholder="ex: Plafonnier LED" 
                        />
                      ) : (
                        <span>{item.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon" asChild>
                        <label htmlFor={`photo-${item.id}`} className="cursor-pointer">
                          <ImageIcon className="h-4 w-4" />
                          <input type="file" id={`photo-${item.id}`} className="sr-only" />
                        </label>
                      </Button>
                    </TableCell>
                    <TableCell>
                      {isEditing(item.id) ? (
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => handleEquipmentChange(item.id, 'quantity', parseInt(e.target.value, 10) || 0)} 
                          className="w-20" 
                        />
                      ) : (
                        <span>{item.quantity}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing(item.id) ? (
                        <div className="flex items-center gap-2">
                          <RadioGroup 
                            value={item.powerCalcMethod} 
                            onValueChange={(value) => handleEquipmentChange(item.id, 'powerCalcMethod', value)} 
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="power" id={`power-${item.id}`} />
                              <Label htmlFor={`power-${item.id}`} className="text-xs">Puissance (W)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="current" id={`current-${item.id}`} />
                              <Label htmlFor={`current-${item.id}`} className="text-xs">Courant (A)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="energy" id={`energy-${item.id}`} />
                              <Label htmlFor={`energy-${item.id}`} className="text-xs">Énergie (kWh/an)</Label>
                            </div>
                          </RadioGroup>
                          <Input 
                            type="number" 
                            value={item.powerValue} 
                            onChange={(e) => handleEquipmentChange(item.id, 'powerValue', parseFloat(e.target.value) || 0)} 
                            className="w-24" 
                          />
                        </div>
                      ) : (
                        <span>{`${item.powerValue} ${getUnit(item.powerCalcMethod)}`}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing(item.id) ? (
                        <Button variant="ghost" size="icon" onClick={() => handleSave(item.id)}>
                          <Save className="h-4 w-4 text-primary" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
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