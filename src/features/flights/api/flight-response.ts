import type { Airport, FlightDetails } from '../types/flight-details.types';
import type { Flight, FlightStatus } from '../types/flight.types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const toNumber = (value: unknown): number | null => {
  const number = Number(value);
  return isNaN(number) ? null : number;
};

const toDate = (value: unknown): Date | null => {
  if (!value) {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
};

const normalizeFlight = (payload: unknown): Flight | null => {
  if (!isRecord(payload)) {
    return null;
  }
  return {
    id: payload.id?.toString() ?? '',
    flightNumber: payload.flight_number?.toString() ?? '',
    destination: payload.destination?.toString() ?? '',
    status: payload.status as FlightStatus,
    gate: payload.gate?.toString(),
    terminal: payload.terminal_number?.toString(),
    airline: payload.airline?.toString(),
    departureTime: toDate(payload.departure_time),
  };
};

const normalizeAirport = (payload: unknown): Airport | null => {
  if (!payload || !isRecord(payload)) {
    return null;
  }
  return {
    code: payload.code?.toString(),
    city: payload.city?.toString(),
    name: payload.name?.toString(),
    latitude: toNumber(payload.latitude),
    longitude: toNumber(payload.longitude),
  };
};

export const parseFlightResponse = (payload: unknown): Flight => {
  const flight = normalizeFlight(payload);
  if (!flight) {
    throw new Error('Invalid flight record');
  }
  return flight;
};

export const parseFlightsResponse = (payload: unknown): Flight[] => {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid flight response');
  }
  return payload.map((item) => normalizeFlight(item)).filter((item) => !!item);
};

export const parseFlightDetailsResponse = (payload: unknown): FlightDetails => {
  const flight = normalizeFlight(payload);
  if (!isRecord(payload) || !flight) {
    throw new Error('Invalid flight details');
  }

  return {
    ...flight,
    aircraft: payload.aircraft?.toString(),
    registration: payload.registration?.toString(),
    durationMinutes: toNumber(payload.duration_minutes),
    origin: normalizeAirport(payload.origin),
    destinationAirport: normalizeAirport(payload.destination_airport),
  };
};
