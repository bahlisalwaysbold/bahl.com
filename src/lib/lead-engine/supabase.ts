type SupabaseConfig = { url: string; key: string };

function getConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

export async function supabaseRequest<T = unknown>(path: string, init: RequestInit = {}) {
  const config = getConfig();
  if (!config) return { data: null as T | null, response: null as Response | null };
  const response = await fetch(config.url + '/rest/v1/' + path, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: 'Bearer ' + config.key,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });
  let data: T | null = null;
  if ((response.headers.get('content-type') ?? '').includes('application/json')) data = (await response.json()) as T;
  return { data, response };
}

export async function supabaseStorageUpload(path: string, file: File) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, configured: false };
  const response = await fetch(url + '/storage/v1/object/lead-files/' + path, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: await file.arrayBuffer(),
    cache: 'no-store',
  });
  return { ok: response.ok, configured: true };
}
