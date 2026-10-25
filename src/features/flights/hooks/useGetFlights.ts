import { useQuery } from '../../../hooks/useQuery/useQuery';
import { getFlights } from '../api/getFlights/getFlights';

export const useGetFlights = () => {
  return useQuery({ queryKey: ['flights'], queryFn: getFlights });
};
