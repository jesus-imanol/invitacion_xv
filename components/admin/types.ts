/** Fila completa de familia (vista admin). */
export type AdminFamilia = {
  id: string;
  nombre: string;
  pases: number;
  token: string;
  confirmado: boolean;
  confirmado_pases: number | null;
  validado: boolean;
  validado_at: string | null;
  created_at: string;
};
