export interface ImageSource {
  url: string;
  width: number;
  height: number;
}

export interface PlaylistMetadata {
  images?: unknown;
}

export function imageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const url = value.startsWith("spotify:image:")
    ? "https://i.scdn.co/image/" + value.slice(14) : value;
  try {
    return new URL(url).protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export function normalizeImageSources(value: unknown): ImageSource[] {
  if (!value || typeof value !== "object") return [];
  const images = Array.isArray(value) ? value : (value as {items?: unknown}).items;
  if (!Array.isArray(images)) return [];
  const result: ImageSource[] = [];
  const seen = new Set<string>();
  for (const image of images) {
    if (!image || typeof image !== "object") continue;
    const sources = Array.isArray(image.sources) ? image.sources : [image];
    for (const source of sources) {
      if (!source || typeof source !== "object") continue;
      const url = imageUrl(source.url ?? source.uri);
      if (!url || seen.has(url)) continue;
      seen.add(url);
      result.push({url, width: Number(source.width ?? source.maxWidth) || 0,
        height: Number(source.height ?? source.maxHeight) || 0});
    }
  }
  return result;
}

export async function getPlaylistMetadata(uri: string): Promise<PlaylistMetadata> {
  try {
    const metadata: unknown = await Spicetify.Platform.PlaylistAPI.getMetadata(uri);
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
      throw new Error("Invalid playlist metadata");
    }
    return metadata as PlaylistMetadata;
  } catch {
    throw new Error("Failed to retrieve playlist data");
  }
}
