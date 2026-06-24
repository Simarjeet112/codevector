import type { CategoriesResponse, ProductsResponse } from './types';

const DEFAULT_API_BASE_URL = '/api';

function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!configured) {
    return DEFAULT_API_BASE_URL;
  }

  return configured.replace(/\/$/, '');
}

const API_BASE_URL = resolveApiBaseUrl();

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
    return new URL(normalizedPath, API_BASE_URL).toString();
  }

  return `${API_BASE_URL}${normalizedPath}`;
}

export interface FetchProductsOptions {
  category?: string;
  cursor?: string | null;
  limit?: number;
  signal?: AbortSignal;
}

export async function fetchProducts({ category, cursor, limit = 50, signal }: FetchProductsOptions): Promise<ProductsResponse> {
  const url = buildUrl('/products');
  const requestUrl = new URL(url, window.location.origin);

  if (category) {
    requestUrl.searchParams.set('category', category);
  }

  if (cursor) {
    requestUrl.searchParams.set('cursor', cursor);
  }

  requestUrl.searchParams.set('limit', String(limit));

  const response = await fetch(requestUrl.toString(), {
    signal,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as ProductsResponse;
}

export async function fetchCategories(signal?: AbortSignal): Promise<string[]> {
  const requestUrl = new URL(buildUrl('/categories'), window.location.origin);

  const response = await fetch(requestUrl.toString(), {
    signal,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as CategoriesResponse;
  return payload.data;
}
