import type { Flight, FlightDto } from './flight';

export interface Airport {
  code: string;
  city: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface FlightDetailsDto extends FlightDto {
  aircraft: string;
  registration: string;
  origin: Airport;
  destination_airport: Airport;
  duration_minutes: number;
}

export interface FlightDetails extends Flight {
  aircraft: string;
  registration: string;
  origin: Airport;
  destinationAirport: Airport;
  durationMinutes: number;
}
