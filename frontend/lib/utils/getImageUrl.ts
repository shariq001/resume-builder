export function getImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  // Remove trailing slash from base url if present
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  // Ensure url starts with slash
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  
  return `${cleanBase}${cleanUrl}`;
}
