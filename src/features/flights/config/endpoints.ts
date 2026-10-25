import { ENV_API_MODE, ENV_API_URL } from '../../../config/environment';

const local = {
  getAll: () => `${ENV_API_URL}/flights`,
  getById: (id: string) => `${ENV_API_URL}/flights/${id}`,
};

const mock = {
  getAll: () => 'https://dummyjson.com/c/7754-e2b8-4e20-b37a',
  getById: (_id: string) => 'https://dummyjson.com/c/e765-ff5a-4184-99b7',
};

export const FLIGHTS_ENDPOINTS = ENV_API_MODE === 'local' ? local : mock;
