import { useQuery } from '../../../hooks/useQuery';
import { getFlights } from '../api/flights.api';

const FLIGHTS_REFETCH_INTERVAL = 30_000;

export function useFlights() {
  return useQuery(getFlights, { refetchInterval: FLIGHTS_REFETCH_INTERVAL });
}
