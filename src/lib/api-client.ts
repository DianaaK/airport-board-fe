import { ResponseType, type RequestOptions } from '../types/api.ts';

export class ApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly statusText: string;
  constructor(status: number, url: string, statusText: string) {
    super(`Request failed (${status}${statusText ? ` ${statusText}` : ''})`);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
    this.statusText = statusText;
  }
}

export const fetcher = async <T>(
  endpoint: string,
  options: RequestOptions = {},
  responseType: ResponseType = ResponseType.JSON,
): Promise<T> => {
  const { secured = false, headers: customHeaders, ...requestOptions } = options;
  const headers = new Headers(customHeaders);

  if (secured) {
    const accessToken = localStorage?.getItem('jwt');
    if (!accessToken) {
      throw new Error('A token is required for a secured request');
    }
    headers.set('authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(endpoint, { ...requestOptions, headers });
  if (!response.ok) {
    throw new ApiError(response.status, response.url, response.statusText);
  }

  switch (responseType) {
    case ResponseType.JSON: {
      const textData = await response.text();
      if (textData) {
        return JSON.parse(textData) as T;
      } else {
        return {} as T;
      }
    }
    case ResponseType.BLOB: {
      const blobData = await response.blob();
      return blobData as unknown as T;
    }
    case ResponseType.TEXT: {
      const textData = await response.text();
      return textData as unknown as T;
    }
    default:
      return {} as T;
  }
};

export const api = {
  get: <T>(
    endpoint: string,
    options?: RequestOptions,
    responseType = ResponseType.JSON,
  ): Promise<T> => {
    return fetcher(endpoint, options, responseType);
  },
  post: <T, V>(
    endpoint: string,
    payload: V,
    options?: RequestOptions,
    responseType = ResponseType.JSON,
  ): Promise<T> => {
    return fetcher(
      endpoint,
      { method: 'POST', body: JSON.stringify(payload), ...options },
      responseType,
    );
  },
};
