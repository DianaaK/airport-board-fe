import type { Flight } from './flight.types';

export interface Airport {
  code?: string | null;
  city?: string | null;
  name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface FlightDetails extends Flight {
  aircraft?: string | null;
  registration?: string | null;
  origin: Airport | null;
  destinationAirport: Airport | null;
  durationMinutes?: number | null;
}
