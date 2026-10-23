export const FLIGHT_STATUSES = ['On Time', 'Delayed', 'Cancelled'] as const;
export type FlightStatus = (typeof FLIGHT_STATUSES)[number];

export interface Flight {
  id: string;
  flightNumber: string;
  destination: string;
  status: FlightStatus;
  gate: string;
  terminal: string;
  airline: string;
  departureTime: string;
}

export interface FlightDto {
  id: string;
  flight_number: string;
  destination: string;
  status: FlightStatus;
  gate: string;
  terminal: string;
  airline: string;
  departure_time: string;
}
