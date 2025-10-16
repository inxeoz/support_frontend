// src/api/issues/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';  // 👈 public env import

const ERP_BASE = env.PUBLIC_ERP_BASE_URL?.replace(/\/$/, '') || '';
const AUTH = `token ${env.PUBLIC_FRAPPE_API_KEY}:${env.PUBLIC_FRAPPE_API_SECRET}`;

async function forward(path: string, opts: RequestInit = {}) {
  const url = `${ERP_BASE.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      ...(opts.headers ?? {}),
      Authorization: AUTH,
      Accept: 'application/json'
    }
  });
  const text = await res.text();
  const contentType = res.headers.get('content-type') ?? '';
  if (res.ok) {
    // Try parse JSON, otherwise return text
    if (contentType.includes('application/json')) return json(JSON.parse(text), { status: res.status });
    return new Response(text, { status: res.status });
  } else {
    // Return error payload
    if (contentType.includes('application/json')) {
      const obj = JSON.parse(text);
      throw error(res.status, obj);
    }
    throw error(res.status, text || res.statusText);
  }
}

export const GET: RequestHandler = async ({ url }) => {
  // support optional query params forwarded
  const qs = url.search ? `?${url.searchParams.toString()}` : '?limit_page_length=50';
  return forward(`/api/resource/Issue${qs}`);
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  return forward('/api/resource/Issue', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  });
};
