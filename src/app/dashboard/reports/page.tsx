import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

const summaryData = [
    { metric: "Puissance Totale Installée", value: "125.6 kW" },
    { metric: "Puissance Installée par la CEET", value: "130 kW" },
    { metric: "Énergie Totale Mensuelle (estimée)", value: "37.5 MWh" },
    { metric: "Énergie Totale Annuelle (estimée)", value: "450 MWh" },
    { metric: "Énergie Diurne Annuelle", value: "280 MWh" },
    { metric: "Énergie Nocturne Annuelle", value: "170 MWh" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Résumé de l'Audit</CardTitle>
          <CardDescription>Aperçu des principaux indicateurs calculés à partir de vos données.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/3">Indicateur</TableHead>
                <TableHead className="text-right">Valeur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryData.map(item => (
                <TableRow key={item.metric}>
                  <TableCell className="font-medium">{item.metric}</TableCell>
                  <TableCell className="text-right font-bold">{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Génération de Rapports</CardTitle>
          <CardDescription>Téléchargez le rapport d'audit complet dans le format de votre choix.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4 sm:flex-row">
            <Button>
                <FileText className="mr-2 h-4 w-4" />
                Générer un PDF
            </Button>
            <Button variant="outline">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exporter en Excel
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
