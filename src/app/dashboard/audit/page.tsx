'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, PlusCircle, Save, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Room {
  id: number;
  name: string;
  level: string;
  manager: string;
}

const levels = [
  { value: '0', label: 'Niveau 0 (RDC)' },
  { value: '1', label: 'Niveau 1 (R+1)' },
  { value: '2', label: 'Niveau 2 (R+2)' },
  { value: '3', label: 'Niveau 3 (R+3)' },
  { value: '4', label: 'Niveau 4 (R+4)' },
  { value: '5', label: 'Niveau 5 (R+5)' },
];

export default function AuditPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: 'Bureau du Directeur', level: '1', manager: 'M. Traoré' },
    { id: 2, name: 'Salle de réunion', level: '1', manager: 'Secrétariat' },
  ]);

  const addRoom = () => {
    const newId = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1;
    setRooms([...rooms, { id: newId, name: `Nouvelle pièce ${newId}`, level: '0', manager: '' }]);
  };

  const removeRoom = (id: number) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration du Bâtiment</CardTitle>
          <CardDescription>Informations de base pour cet audit.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Date de l'audit</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale: fr }) : <span>Choisissez une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="building-name">Nom du bâtiment</Label>
              <Input id="building-name" defaultValue="Siège Social (audit)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="levels">Nombre de niveaux</Label>
               <Select defaultValue="5">
                <SelectTrigger id="levels">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 11 }, (_, i) => (
                    <SelectItem key={i} value={String(i)}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ajout des Pièces</CardTitle>
              <CardDescription>Renseignez les informations pour chaque pièce auditée.</CardDescription>
            </div>
            <Button onClick={addRoom}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une pièce
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">Nom de la pièce</TableHead>
                <TableHead className="w-[25%]">Niveau</TableHead>
                <TableHead className="w-[30%]">Nom du responsable</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <Input defaultValue={room.name} className="h-8" />
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={room.level}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map(level => (
                          <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input defaultValue={room.manager} className="h-8" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => removeRoom(room.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer la Configuration
        </Button>
      </div>
    </div>
  );
}
