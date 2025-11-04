// Types pour les Prises Électriques
export interface PriseElectrique {
  id?: number;
  installation_id: number;
  reference: string;
  etat: 'bon' | 'defectueux' | 'non_installe' | 'a_remplacer' | 'manquant';
  commentaire?: string;
  photo_prise?: string[];
  localisation?: string;
  avec_terre?: boolean;
  ordre?: number;
  created_at?: string;
  updated_at?: string;
  installation?: Installation;
}

// Types pour les Interrupteurs
export interface Interrupteur {
  id?: number;
  installation_id: number;
  reference: string;
  etat: 'bon' | 'defectueux' | 'non_installe' | 'a_remplacer' | 'manquant';
  commentaire?: string;
  photo_interrupteur?: string[];
  localisation?: string;
  type_interrupteur?: string;
  ordre?: number;
  created_at?: string;
  updated_at?: string;
  installation?: Installation;
}

// Type pour les Installations
export interface Installation {
  id?: number;
  client_id: number;
  type_compteur: 'BT' | 'MT';
  configuration_compteur: '2 fils' | '4 fils';
  amperage: number;
  composantes_coffret?: string;
  photo_coffret?: string[];
  cable_type?: string;
  photo_cable_electrique?: string[];
  photo_type_cable?: string[];
  commentaire_cable?: string;
  protection_terre?: boolean;
  barette_de_coupure?: boolean;
  photo_barette_coupure?: string[];
  valeur_terre?: number;
  terre_dans_pc?: boolean;
  photo_terre_pc?: string[];
  presence_differentiel?: boolean;
  commentaire_terre?: string;
  date_installation: string;
  created_at?: string;
  updated_at?: string;
  client?: any; // Type Client à définir si nécessaire
  prises?: PriseElectrique[];
  interrupteurs?: Interrupteur[];
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Types pour les formulaires
export interface PriseElectriqueForm {
  id?: number;
  installation_id: number;
  reference: string;
  etat: 'bon' | 'defectueux' | 'non_installe' | 'a_remplacer' | 'manquant';
  commentaire: string;
  localisation: string;
  avec_terre: boolean;
  ordre: number;
  photos: File[];
  [key: string]: number | string | boolean | File[] | undefined;
}

export interface InterrupteurForm {
  id?: number;
  installation_id: number;
  reference: string;
  etat: string;
  commentaire: string;
  localisation: string;
  type_interrupteur: string;
  ordre: number;
  photos: File[];
}

export interface InstallationForm {
  client_id: number;
  type_compteur: 'BT' | 'MT';
  configuration_compteur: '2 fils' | '4 fils';
  amperage: number;
  composantes_coffret: string;
  cable_type: string;
  commentaire_cable: string;
  protection_terre: boolean;
  barette_de_coupure: boolean;
  valeur_terre: number;
  terre_dans_pc: boolean;
  presence_differentiel: boolean;
  commentaire_terre: string;
  date_installation: string;
  photo_coffret: File[];
  photo_cable_electrique: File[];
  photo_type_cable: File[];
  photo_barette_coupure: File[];
  photo_terre_pc: File[];
}