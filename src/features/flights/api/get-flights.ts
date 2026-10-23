import { ENV_API_URL } from '../../../config/environment';
import { api } from '../../../lib/api-client';
import { type Flight, type FlightDto } from '../types/flight';

const mapFlightDtoToFlight = (dto: FlightDto): Flight => {
  return {
    id: dto.id,
    flightNumber: dto.flight_number,
    destination: dto.destination,
    status: dto.status,
    gate: dto.gate,
    terminal: dto.terminal,
    airline: dto.airline,
    departureTime: dto.departure_time,
  };
};

export const parseFlightsResponse = (payload: unknown): Flight[] => {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid flight response');
  }
  return payload.map((value: unknown) => {
    if (!value || typeof value !== 'object') {
      throw new Error('Invalid flight record');
    }
    return mapFlightDtoToFlight(value as FlightDto);
  });
};

export const getFlights = async (signal: AbortSignal): Promise<Flight[]> => {
  const endpoint = ENV_API_URL.toString();
  const response = await api.get<unknown>(endpoint, { signal, cache: 'no-store' });

  return parseFlightsResponse(response);
};
