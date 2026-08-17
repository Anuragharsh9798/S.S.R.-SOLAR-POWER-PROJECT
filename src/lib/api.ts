/**
 * SSR SOLAR POWER Backend API Client
 * Centralized, typed API client supporting GET, POST, PATCH, DELETE operations
 * with HttpOnly credentials, timeout, error handling, and environment-based baseURL.
 */

const API_BASE_URL =
  (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:3000';

export interface ApiErrorResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  timestamp?: string;
}

export class ApiError extends Error {
  statusCode: number;
  errorData?: ApiErrorResponse;

  constructor(message: string, statusCode: number, errorData?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorData = errorData;
  }
}

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  timeoutMs?: number;
}

/**
 * Reusable typed fetch client for communicating with the NestJS backend.
 */
export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeoutMs = 15000, headers, body, ...customConfig } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...(headers as Record<string, string>),
    },
    signal: controller.signal,
    ...customConfig,
  };

  if (body !== undefined && body !== null) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Handle non-2xx HTTP responses
    if (!response.ok) {
      let errorData: ApiErrorResponse | undefined;
      let errorMessage = `HTTP Request failed with status ${response.status}`;

      try {
        errorData = await response.json();
        if (errorData?.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : errorData.message;
        }
      } catch {
        // Non-JSON response
      }

      throw new ApiError(errorMessage, response.status, errorData);
    }

    // Handle empty 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err.name === 'AbortError') {
      throw new ApiError(`Request timeout after ${timeoutMs}ms`, 408);
    }

    throw new ApiError(
      err.message || 'Network error: Unable to connect to SSR Solar Power backend',
      0
    );
  }
}

// Convenience REST Helpers
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'POST', body }),

  patch: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
