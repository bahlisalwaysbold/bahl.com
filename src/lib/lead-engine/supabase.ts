type SupabaseConfig = { url: string; key: string };

function getConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
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
  if ((response.headers.get('content-type') ?? '').includes('application/json')) {
    data = (await response.json()) as T;
  }
  return { data, response };
}

export async function supabaseStorageUpload(path: string, file: File) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, configured: false };
  const response = await fetch(url + '/storage/v1/object/lead-files/' + encodeURI(path), {
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

export async function supabaseStorageDelete(path: string) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  const response = await fetch(url + '/storage/v1/object/lead-files/' + encodeURI(path), {
    method: 'DELETE',
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
    },
    cache: 'no-store',
  });
  return response.ok;
}

export async function supabaseStorageSignedUrl(path: string, expiresIn = 600) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, url: null as string | null };
  const response = await fetch(url + '/storage/v1/object/sign/lead-files/' + encodeURI(path), {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn }),
    cache: 'no-store',
  });
  if (!response.ok) return { ok: false, url: null as string | null };
  const data = await response.json().catch(() => null) as { signedURL?: string } | null;
  if (!data?.signedURL) return { ok: false, url: null as string | null };
  const signedUrl = data.signedURL.startsWith('http') ? data.signedURL : url + '/storage/v1' + data.signedURL;
  return { ok: true, url: signedUrl };
}