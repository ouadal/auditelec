'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DollarSign,
  Lightbulb,
  Zap,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
  Line,
  LineChart,
  BarChart as RechartsBarChart,
} from 'recharts';

const stats = [
  {
    title: 'Puissance Totale Installée',
    value: '125.6 kW',
    icon: Zap,
    change: '+5.2% vs mois dernier',
    color: 'bg-orange-500'
  },
  {
    title: 'Énergie Totale Annuelle',
    value: '450 MWh',
    icon: Lightbulb,
    change: '+2.1% vs année dernière',
    color: 'bg-green-500'
  },
  {
    title: 'Énergie Diurne',
    value: '280 MWh',
    icon: Clock,
    change: '62% du total',
    color: 'bg-red-500'
  },
  {
    title: 'Énergie Nocturne',
    value: '170 MWh',
    icon: Clock,
    change: '38% du total',
    color: 'bg-cyan-500'
  },
];

const energyData = [
    { name: 'Jan', 'Énergie (MWh)': 35, 'CEET (MWh)': 30 },
    { name: 'Fév', 'Énergie (MWh)': 38, 'CEET (MWh)': 32 },
    { name: 'Mar', 'Énergie (MWh)': 42, 'CEET (MWh)': 34 },
    { name: 'Avr', 'Énergie (MWh)': 40, 'CEET (MWh)': 35 },
    { name: 'Mai', 'Énergie (MWh)': 45, 'CEET (MWh)': 38 },
    { name: 'Jui', 'Énergie (MWh)': 48, 'CEET (MWh)': 40 },
    { name: 'Jul', 'Énergie (MWh)': 50, 'CEET (MWh)': 42 },
];

const equipmentData = [
  { name: 'Éclairage', 'Puissance (kW)': 30 },
  { name: 'Climatisation', 'Puissance (kW)': 55 },
  { name: 'Bureautique', 'Puissance (kW)': 25 },
  { name: 'Autres', 'Puissance (kW)': 15.6 },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className={`p-3 rounded-md text-white ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-right text-muted-foreground">{stat.title}</CardTitle>
                 <div className="text-2xl font-bold text-right">{stat.value}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Évolution de la Consommation</CardTitle>
            <CardDescription>
              Énergie totale mensuelle vs. prévisions CEET.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} MWh`}
                />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="Énergie (MWh)" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="CEET (MWh)" stroke="hsl(var(--accent))" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Puissance par Type d'Équipement</CardTitle>
            <CardDescription>
              Répartition de la puissance installée.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsBarChart data={equipmentData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} kW`}
                />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="Puissance (kW)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
