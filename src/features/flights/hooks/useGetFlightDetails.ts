import { useQuery } from '../../../hooks/useQuery/useQuery';
import { getFlightDetails } from '../api/getFlightDetails/getFlightDetails';

export const useGetFlightDetails = (id: string) => {
  return useQuery({
    queryFn: (signal) => getFlightDetails(signal, id),
    queryKey: ['flights', id],
  });
};
