import { api } from '@lib/api-client';

import { FLIGHTS_ENDPOINTS } from '../../config/endpoints';
import type { Flight } from '../../types/flight.types';
import { parseFlightsResponse } from '../flight-response';

export const getFlights = async (signal: AbortSignal): Promise<Flight[]> => {
  const response = await api.get<unknown>(FLIGHTS_ENDPOINTS.getAll(), {
    signal,
    cache: 'no-store',
  });

  return parseFlightsResponse(response);
};
