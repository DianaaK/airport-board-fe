import { ENV_API_URL } from '../../../config/environment';
import { api } from '../../../lib/api-client';
import { type Flight, type FlightDto } from '../types/flight';

const isFlightDto = (value: unknown): value is FlightDto => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  const requiredFields = ['id', 'flight_number', 'destination', 'status', 'terminal_number'];
  if (!requiredFields.every((field) => Object.hasOwn(record, field))) {
    return false;
  }
  return !record.departure_time || Number.isFinite(Date.parse(record.departure_time as string));
};

const mapFlightDtoToFlight = (dto: FlightDto): Flight => {
  return {
    id: dto.id,
    flightNumber: dto.flight_number,
    destination: dto.destination,
    status: dto.status,
    gate: dto.gate,
    terminal: dto.terminal_number,
    airline: dto.airline,
    departureTime: dto.departure_time,
  };
};

export const parseFlightsResponse = (payload: unknown): Flight[] => {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid flight response');
  }
  return payload.map((value: unknown) => {
    if (!isFlightDto(value)) {
      throw new Error('Invalid flight record');
    }
    return mapFlightDtoToFlight(value);
  });
};

export const getFlights = async (signal: AbortSignal): Promise<Flight[]> => {
  const endpoint = ENV_API_URL.toString();
  const response = await api.get<unknown>(endpoint, { signal, cache: 'no-store' });

  return parseFlightsResponse(response);
};
