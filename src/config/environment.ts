const environment = import.meta.env ?? {};

export const ENV_API_URL = environment.VITE_API_URL || '';
