import { useQuery } from '../../../hooks/useQuery/useQuery';
import { getFlights } from '../api/get-flights';

export const useGetFlights = () => {
  return useQuery(getFlights);
};
