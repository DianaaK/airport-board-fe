import { api } from '@lib/api-client';

import { FLIGHTS_ENDPOINTS } from '../../config/endpoints';
import type { FlightDetails } from '../../types/flight-details.types';
import { parseFlightDetailsResponse } from '../flight-response';

export const getFlightDetails = async (signal: AbortSignal, id: string): Promise<FlightDetails> => {
  const response = await api.get<unknown>(FLIGHTS_ENDPOINTS.getById(id), {
    signal,
    cache: 'no-store',
  });
  return parseFlightDetailsResponse(response);
};
