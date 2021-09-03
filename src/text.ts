/** Returns the string with leading & trailing whitespace trimmed and normalized to Unicode Normalization Form D. */
export function normalize(text: string): string {
  return text.trim().normalize("NFD");
}
