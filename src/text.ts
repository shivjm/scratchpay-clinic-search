export function normalize(text: string): string {
  return text.trim().normalize("NFD");
}
