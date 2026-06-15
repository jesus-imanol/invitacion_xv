/** Datos públicos de una familia (de la RPC get_familia_by_token). */
export type FamiliaPublica = {
  nombre: string;
  pases: number;
  token: string;
  confirmado: boolean;
  confirmadoPases?: number | null;
  validado?: boolean;
};
