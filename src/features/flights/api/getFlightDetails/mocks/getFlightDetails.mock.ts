import { flights } from '../../getFlights/mocks/getFlights.mock';
import type { FlightDetailsDto } from '../../types/flight-dto.types';

export const flightDetails: FlightDetailsDto = {
  ...flights[0],
  aircraft: 'Airbus A318',
  registration: 'YR-ASA',
  duration_minutes: 150,
  origin: {
    code: 'CLJ',
    city: 'Cluj-Napoca',
    name: 'Avram Iancu International Airport',
    latitude: 46.783389,
    longitude: 23.684194,
  },
  destination_airport: {
    code: 'CDG',
    city: 'Paris',
    name: 'Charles de Gaulle Airport',
    latitude: 49.0097,
    longitude: 2.5479,
  },
};
