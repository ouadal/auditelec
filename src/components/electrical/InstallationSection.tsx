'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Save, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { installationService } from '../../../services/electricalApi';
import { Installation } from '@/types/electrical';

interface InstallationSectionProps {
  clientId?: number;
}

export function InstallationSection({ clientId = 1 }: InstallationSectionProps) {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [newInstallation, setNewInstallation] = useState({
    client_id: clientId,
    type_compteur: 'BT' as 'BT' | 'MT',
    configuration_compteur: '4 fils' as '2 fils' | '4 fils',
    amperage: 25,
    composantes_coffret: '',
    cable_type: '',
    date_installation: new Date().toISOString().split('T')[0],
    commentaire_cable: '',
    protection_terre: true,
    barette_de_coupure: true,
    valeur_terre: 0,
    terre_dans_pc: true,
    presence_differentiel: true,
    commentaire_terre: ''
  });

  useEffect(() => {
    loadInstallations();
  }, [clientId]);

  const loadInstallations = async () => {
    try {
      setLoading(true);
      const response = await installationService.getAll();
      if (response.success) {
        setInstallations(response.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des installations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les installations électriques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstallation = async () => {
    try {
      setSaving(true);
      const response = await installationService.create(newInstallation);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Installation électrique ajoutée avec succès",
        });
        setNewInstallation({
          client_id: clientId,
          type_compteur: 'BT' as 'BT' | 'MT',
          configuration_compteur: '4 fils' as '2 fils' | '4 fils',
          amperage: 25,
          composantes_coffret: '',
          cable_type: '',
          date_installation: new Date().toISOString().split('T')[0],
          commentaire_cable: '',
          protection_terre: true,
          barette_de_coupure: true,
          valeur_terre: 0,
          terre_dans_pc: true,
          presence_differentiel: true,
          commentaire_terre: ''
        });
        setShowAddForm(false);
        await loadInstallations();
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'installation:', error);
      let errorMessage = "Erreur lors de l'ajout de l'installation";
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        errorMessage = validationErrors.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast({
        title: "Erreur de validation",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteInstallation = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette installation ?')) return;
    try {
      const response = await installationService.delete(id);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Installation électrique supprimée avec succès",
        });
        await loadInstallations();
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'installation",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Les installations électriques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" text="Chargement des installations..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Les installations électriques</CardTitle>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une installation
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showAddForm && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Nouvelle installation électrique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Informations générales</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type_compteur">Type de compteur *</Label>
                    <Select 
                      value={newInstallation.type_compteur} 
                      onValueChange={(value: 'BT' | 'MT') => setNewInstallation(prev => ({ ...prev, type_compteur: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BT">Basse Tension (BT)</SelectItem>
                        <SelectItem value="MT">Moyenne Tension (MT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="configuration_compteur">Configuration *</Label>
                    <Select 
                      value={newInstallation.configuration_compteur} 
                      onValueChange={(value: '2 fils' | '4 fils') => setNewInstallation(prev => ({ ...prev, configuration_compteur: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2 fils">2 fils</SelectItem>
                        <SelectItem value="4 fils">4 fils</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amperage">Ampérage (A) *</Label>
                    <Input
                      id="amperage"
                      type="number"
                      value={newInstallation.amperage}
                      onChange={(e) => setNewInstallation(prev => ({ ...prev, amperage: parseInt(e.target.value) || 0 }))}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_installation">Date d'installation *</Label>
                  <Input
                    id="date_installation"
                    type="date"
                    value={newInstallation.date_installation}
                    onChange={(e) => setNewInstallation(prev => ({ ...prev, date_installation: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Protection et mise à la terre</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="protection_terre"
                      checked={newInstallation.protection_terre}
                      onCheckedChange={(checked) => setNewInstallation(prev => ({ ...prev, protection_terre: !!checked }))}
                    />
                    <Label htmlFor="protection_terre">Protection terre</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="presence_differentiel"
                      checked={newInstallation.presence_differentiel}
                      onCheckedChange={(checked) => setNewInstallation(prev => ({ ...prev, presence_differentiel: !!checked }))}
                    />
                    <Label htmlFor="presence_differentiel">Présence différentiel</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={saving}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddInstallation} disabled={saving}>
                    {saving ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {installations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Installations enregistrées ({installations.length})
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead className="w-12">
                      <span className="text-blue-600">⚡</span>
                    </TableHead>
                    <TableHead className="font-semibold">Type/Config</TableHead>
                    <TableHead className="font-semibold">Ampérage</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Protection</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installations.map((installation) => (
                    <TableRow key={installation.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">{installation.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">
                            {installation.type_compteur} - {installation.configuration_compteur}
                          </div>
                          <div className="text-xs text-gray-500">
                            {installation.cable_type || 'Type de câble non spécifié'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm font-medium">
                          {installation.amperage}A
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700">
                          {new Date(installation.date_installation).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {installation.protection_terre && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                              🌍 Terre
                            </span>
                          )}
                          {installation.presence_differentiel && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs ml-1">
                              🔒 Diff
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => installation.id && handleDeleteInstallation(installation.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}