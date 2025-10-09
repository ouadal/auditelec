import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

export default function BuildingInfoPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations Générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="building-name">Nom du bâtiment</Label>
              <Input id="building-name" placeholder="ex: Siège Social" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stats-institute">Institut de Statistique</Label>
              <Input id="stats-institute" placeholder="ex: INSAE" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-address">Adresse du site</Label>
              <Input id="site-address" placeholder="ex: 123 Rue de la République" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commune">Commune</Label>
              <Input id="commune" placeholder="ex: Cotonou" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="service-year">Année de mise en service</Label>
              <Input id="service-year" type="number" placeholder="ex: 2010" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="building-type">Type/Fonction du bâtiment</Label>
              <Input id="building-type" placeholder="ex: Bureaux administratifs" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Détails du Bâtiment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="built-surface">Surface construite (m²)</Label>
              <Input id="built-surface" type="number" placeholder="ex: 1500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lease-type">Type de bail</Label>
              <Input id="lease-type" placeholder="ex: Propriétaire" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floors">Nombre d’étages</Label>
              <Input id="floors" type="number" placeholder="ex: 5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="building-shape">Forme du bâtiment</Label>
              <Input id="building-shape" placeholder="ex: Rectangulaire" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avg-floor-height">Hauteur moyenne d’un étage (m)</Label>
              <Input id="avg-floor-height" type="number" placeholder="ex: 3.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perimeter">Périmètre du bâtiment (m)</Label>
              <Input id="perimeter" type="number" placeholder="ex: 200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workers">Nombre de travailleurs</Label>
              <Input id="workers" type="number" placeholder="ex: 80" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ac-surface">Surface climatisée (m²)</Label>
              <Input id="ac-surface" type="number" placeholder="ex: 1200" />
            </div>
             <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-4">
              <Label htmlFor="total-surface">Surface totale du bâtiment (m²)</Label>
              <Input id="total-surface" type="number" placeholder="ex: 2500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="contact-name">Nom et fonction</Label>
                    <Input id="contact-name" placeholder="ex: Jean Dupont, Responsable technique" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact-info">Téléphone / E-mail</Label>
                    <Input id="contact-info" placeholder="ex: +229 99000099 / j.dupont@example.com" />
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les Informations
        </Button>
      </div>
    </div>
  );
}
