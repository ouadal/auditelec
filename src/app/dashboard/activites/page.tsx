"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiHelpers } from "../../../../services/apiHelpers";
import {
  Activity,
  User,
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  FileEdit,
  FilePlus,
  Trash2,
} from "lucide-react";

interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  model: string;
  model_id: number | null;
  description: string;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  created_at: string;
  user: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
  };
}

interface Stats {
  total_actions: number;
  actions_today: number;
  actions_this_week: number;
  by_action: Array<{ action: string; count: number }>;
  by_user: Array<{ user_id: number; count: number; user: any }>;
  recent_actions: ActivityLog[];
}

export default function ActivitesPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  // Filtres
  const [filters, setFilters] = useState({
    user_id: "all",
    action: "all",
    model: "all",
  });

  // Vérifier le rôle admin
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        toast({
          title: "Accès refusé",
          description:
            "Vous n'avez pas les permissions pour accéder à cette page",
          variant: "destructive",
        });
        router.push("/dashboard");
        return;
      }
    }
  }, [router, toast]);

  // Charger les données
  const loadData = async () => {
    setLoading(true);
    try {
      // Préparer les filtres en excluant les valeurs "all"
      const apiFilters: any = {};
      if (filters.user_id !== "all") apiFilters.user_id = filters.user_id;
      if (filters.action !== "all") apiFilters.action = filters.action;
      if (filters.model !== "all") apiFilters.model = filters.model;

      const [logsResponse, statsResponse, usersResponse] = await Promise.all([
        apiHelpers.activityLogs.getAll(apiFilters),
        apiHelpers.activityLogs.getStats(),
        apiHelpers.techniciens.getAll(),
      ]);

      setLogs(logsResponse.data?.data?.data || []);
      setStats(statsResponse.data?.data || null);
      setUsers(usersResponse.data?.data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de chargement des activités",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <FilePlus className="h-4 w-4 text-green-600" />;
      case "update":
        return <FileEdit className="h-4 w-4 text-blue-600" />;
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionBadge = (action: string) => {
    const variants: any = {
      create: "default",
      update: "secondary",
      delete: "destructive",
    };
    const labels: any = {
      create: "Création",
      update: "Modification",
      delete: "Suppression",
    };
    return (
      <Badge variant={variants[action] || "outline"}>
        {labels[action] || action}
      </Badge>
    );
  };

  const getModelLabel = (model: string) => {
    const labels: any = {
      Client: "Projet",
      Equipement: "Équipement",
      Batiment: "Bâtiment",
      Piece: "Pièce",
      Audit: "Audit",
      Technicien: "Utilisateur",
    };
    return labels[model] || model;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Historique des Activités</h1>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Actions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_actions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.actions_today}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cette Semaine
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.actions_this_week}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Utilisateur</Label>
              <Select
                value={filters.user_id}
                onValueChange={(value) =>
                  setFilters({ ...filters, user_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.prenom} {user.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Action</Label>
              <Select
                value={filters.action}
                onValueChange={(value) =>
                  setFilters({ ...filters, action: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="create">Création</SelectItem>
                  <SelectItem value="update">Modification</SelectItem>
                  <SelectItem value="delete">Suppression</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Modèle</Label>
              <Select
                value={filters.model}
                onValueChange={(value) =>
                  setFilters({ ...filters, model: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="Client">Projet</SelectItem>
                  <SelectItem value="Equipement">Équipement</SelectItem>
                  <SelectItem value="Batiment">Bâtiment</SelectItem>
                  <SelectItem value="Piece">Pièce</SelectItem>
                  <SelectItem value="Audit">Audit</SelectItem>
                  <SelectItem value="Technicien">Utilisateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des activités */}
      <Card>
        <CardHeader>
          <CardTitle>Activités Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="mt-1">{getActionIcon(log.action)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {getActionBadge(log.action)}
                    <Badge variant="outline">{getModelLabel(log.model)}</Badge>
                  </div>
                  <p className="text-sm font-medium">{log.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>
                        {log.user.prenom} {log.user.nom}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(log.created_at)}</span>
                    </div>
                    {log.ip_address && (
                      <span className="text-xs">IP: {log.ip_address}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">Aucune activité</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Aucune activité ne correspond aux filtres sélectionnés.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
