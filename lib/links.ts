/** Base URL pública (sin slash final). */
export function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
}

/** Link de invitación personalizado de una familia. */
export function invitationUrl(token: string): string {
  return `${baseUrl()}/i/${token}`;
}
