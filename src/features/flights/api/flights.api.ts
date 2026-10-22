import { ENV_API_URL } from '../../../config/environment';
import { api } from '../../../lib/api-client';
import { FLIGHT_STATUSES, type Flight, type FlightDto } from '../flight.types';

export function mapFlightDtoToFlight(dto: FlightDto): Flight {
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
}

// Transport validation and mapping stay outside the UI.
export function parseFlightsResponse(payload: unknown): Flight[] {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid flight response');
  }
  const ids = new Set<string>();
  return payload.map((value: unknown) => {
    if (!value || typeof value !== 'object') throw new Error('Invalid flight record');
    const row = value as Record<string, unknown>;
    for (const field of [
      'id',
      'flight_number',
      'destination',
      'status',
      'gate',
      'terminal',
      'airline',
      'departure_time',
    ]) {
      if (typeof row[field] !== 'string' || !row[field].trim())
        throw new Error(`Invalid field: ${field}`);
    }
    if (
      !FLIGHT_STATUSES.includes(row.status as Flight['status']) ||
      !Number.isFinite(Date.parse(row.departure_time as string)) ||
      ids.has(row.id as string)
    ) {
      throw new Error('Invalid status, departure time, or duplicate flight ID');
    }
    ids.add(row.id as string);
    // All required DTO fields have been validated above.
    return mapFlightDtoToFlight(row as unknown as FlightDto);
  });
}

export async function getFlights(signal: AbortSignal): Promise<Flight[]> {
  // Absolute demo URL bypasses the REST base URL, preserving the local fallback.
  const endpoint =
    ENV_API_URL || new URL(`${ENV_API_URL}flights.json`, window.location.origin).href;
  const payload = await api.get<unknown>(endpoint, { signal, cache: 'no-store' });
  return parseFlightsResponse(payload);
}
