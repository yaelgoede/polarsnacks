import { createClient } from "./server";

export async function getSignedPhotoUrl(
  bucket: string,
  path: string | null,
  expiresIn = 3600
): Promise<string | null> {
  if (!path) return null;
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  return data?.signedUrl ?? null;
}

export async function getSignedPhotoUrls(
  bucket: string,
  paths: (string | null)[]
): Promise<(string | null)[]> {
  const supabase = await createClient();
  const results = await Promise.all(
    paths.map(async (path) => {
      if (!path) return null;
      const { data } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600);
      return data?.signedUrl ?? null;
    })
  );
  return results;
}
