export interface EquipementData {
  piece_id: number;
  type_equipement_id: number;
  nom_equipement: string;
  nombre: number;
  valeur_mesuree: number;
  type_valeur: 'tension' | 'courant' | 'puissance' | 'energie';
  tension?: number;
  courant?: number;
  heures_utilisation_jour: number;
  photos: string[];
}

export interface Equipement extends EquipementData {
  id: number;
  piece?: {
    id: number;
    nom_piece: string;
    batiment?: {
      id: number;
      nom_batiment: string;
    };
  };
  type_equipement?: {
    id: number;
    nom: string;
  };
  energie_avec_unite?: string;
  created_at?: string;
  updated_at?: string;
}