import type { FlightStatus } from '../../types/flight.types';

export interface FlightDto {
  id: string;
  flight_number: string;
  destination: string;
  status: FlightStatus;
  gate?: string;
  terminal_number: string;
  airline?: string;
  departure_time?: string;
}

export interface AirportDto {
  code: string;
  city: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface FlightDetailsDto extends FlightDto {
  aircraft: string;
  registration: string;
  origin: AirportDto;
  destination_airport: AirportDto;
  duration_minutes: number;
}
