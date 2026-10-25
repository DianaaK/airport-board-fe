import { api } from '../../../../lib/api-client';
import { FLIGHTS_ENDPOINTS } from '../../config/endpoints';
import type { FlightDetails, Airport } from '../../types/flight-details';
import { parseFlightResponse } from '../getFlights/getFlights';

const parseAirport = (payload: unknown): Airport => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid airport');
  }
  const airport = payload as Record<string, unknown>;

  const requiredFields = ['code', 'city', 'name', 'latitude', 'longitude'];
  if (!requiredFields.every((field) => Object.hasOwn(airport, field))) {
    throw new Error('Invalid airport');
  }

  return {
    code: airport.code as string,
    city: airport.city as string,
    name: airport.name as string,
    latitude: airport.latitude as number,
    longitude: airport.longitude as number,
  };
};

export const parseFlightDetailsResponse = (payload: unknown): FlightDetails => {
  const flight = parseFlightResponse(payload);
  const record = payload as Record<string, unknown>;

  const requiredFields = ['aircraft', 'registration', 'duration_minutes'];
  if (!requiredFields.every((field) => Object.hasOwn(record, field))) {
    throw new Error('Invalid flight details');
  }

  return {
    ...flight,
    aircraft: record.aircraft as string,
    registration: record.registration as string,
    durationMinutes: record.duration_minutes as number,
    origin: parseAirport(record.origin),
    destinationAirport: parseAirport(record.destination_airport),
  };
};

export const getFlightDetails = async (signal: AbortSignal, id: string) => {
  const response = await api.get<unknown>(FLIGHTS_ENDPOINTS.getById(id), {
    signal,
    cache: 'no-store',
  });
  return parseFlightDetailsResponse(response);
};
