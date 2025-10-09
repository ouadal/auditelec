import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const weekend = ['Samedi', 'Dimanche'];

export default function EnergyPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temps d'Utilisation Diurne (06h - 18h)</CardTitle>
          <CardDescription>Entrez le nombre d'heures de fonctionnement par jour.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-semibold">Par Semaine</Label>
            <div className="grid grid-cols-2 gap-4 mt-2 md:grid-cols-5">
              {weekdays.map(day => (
                <div key={day} className="space-y-2">
                  <Label htmlFor={`diurnal-week-${day.toLowerCase()}`}>{day}</Label>
                  <Input id={`diurnal-week-${day.toLowerCase()}`} type="number" placeholder="ex: 8" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Label className="font-semibold">Par Weekend</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {weekend.map(day => (
                <div key={day} className="space-y-2">
                  <Label htmlFor={`diurnal-weekend-${day.toLowerCase()}`}>{day}</Label>
                  <Input id={`diurnal-weekend-${day.toLowerCase()}`} type="number" placeholder="ex: 2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Temps d'Utilisation Nocturne (18h - 06h)</CardTitle>
          <CardDescription>Entrez le nombre d'heures de fonctionnement par nuit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-semibold">Par Semaine</Label>
            <div className="grid grid-cols-2 gap-4 mt-2 md:grid-cols-5">
              {weekdays.map(day => (
                <div key={day} className="space-y-2">
                  <Label htmlFor={`nocturnal-week-${day.toLowerCase()}`}>{day}</Label>
                  <Input id={`nocturnal-week-${day.toLowerCase()}`} type="number" placeholder="ex: 1" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Label className="font-semibold">Par Weekend</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {weekend.map(day => (
                <div key={day} className="space-y-2">
                  <Label htmlFor={`nocturnal-weekend-${day.toLowerCase()}`}>{day}</Label>
                  <Input id={`nocturnal-weekend-${day.toLowerCase()}`} type="number" placeholder="ex: 4" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les Calculs
        </Button>
      </div>
    </div>
  );
}
