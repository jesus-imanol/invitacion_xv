/** Helpers para el link de WhatsApp del RSVP. */

const soloDigitos = (n: string) => n.replace(/\D/g, "");

/** true si el número parece válido (10-15 dígitos, con lada de país). */
export function waValido(numero: string): boolean {
  const d = soloDigitos(numero);
  return /^\d{10,15}$/.test(d);
}

/** Construye el link wa.me con mensaje prellenado. */
export function waLink(numero: string, mensaje: string): string {
  return `https://wa.me/${soloDigitos(numero)}?text=${encodeURIComponent(mensaje)}`;
}
