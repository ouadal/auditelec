// Utility to resolve a photo URL coming from backend or local
export const resolvePhotoUrl = (photo: string) => {
  if (
    photo.startsWith("http://") ||
    photo.startsWith("https://") ||
    photo.startsWith("blob:") ||
    photo.startsWith("data:")
  ) {
    return photo;
  }

  // Normalize path: convert backslashes and remove leading slashes
  const cleaned = photo
    .replace(/\\+/g, "/")
    .replace(/^\/+/, "");

  // Determine origin from NEXT_PUBLIC_API_URL or fallback
  let origin = "http://127.0.0.1:8000";
  try {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    const u = new URL(envUrl);
    origin = `${u.protocol}//${u.hostname}${u.port ? ":" + u.port : ""}`;
  } catch {}

  // If the path starts with 'equipements/', don't add 'storage/'
  if (cleaned.startsWith('equipements/')) {
    return `${origin}/${cleaned}`;
  }

  // For other paths, add 'storage/' prefix
  return `${origin}/storage/${cleaned}`;
};