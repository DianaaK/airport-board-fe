const environment = import.meta.env ?? {};

export const ENV_API_URL = environment.VITE_API_URL || '';
export const ENV_API_MODE = environment.VITE_API_MODE || 'dummyjson';
