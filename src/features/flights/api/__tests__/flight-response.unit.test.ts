import { describe, expect, it } from 'vitest';

import {
  parseFlightsResponse,
  parseFlightResponse,
  parseFlightDetailsResponse,
} from '../flight-response';
import { flightDetails } from '../getFlightDetails/mocks/getFlightDetails.mock';
import { flights } from '../getFlights/mocks/getFlights.mock';

describe('flight response normalization', () => {
  it('parseFlightsResponse skips invalid data', () => {
    const result = parseFlightsResponse([flights[0], { id: 2 }, 'invalid']);
    expect(result).toHaveLength(2);
    expect(result.map((flight) => flight.id)).toEqual(['1', '2']);
    expect(result[0].flightNumber).toBe('RO101');
    expect(result[1].flightNumber).toBe('');
  });

  it('parseFlightResponse maps correct fields and ignores unknown data', () => {
    expect(parseFlightResponse({ ...flights[0], unknown_field: 'some data' })).toEqual({
      id: '1',
      flightNumber: 'RO101',
      destination: 'Paris',
      status: 'On Time',
      gate: '2',
      terminal: '1',
      airline: 'TAROM',
      departureTime: new Date('2026-10-24T12:00:00Z'),
    });
  });

  it('parseFlightResponse handles a nullish departure time', () => {
    expect(parseFlightResponse({ ...flights[0], departure_time: null }).departureTime).toBeNull();
  });

  it('parseFlightResponse preserves an existing valid Date object', () => {
    const departure = new Date('2026-10-24T12:00:00Z');
    expect(parseFlightResponse({ ...flights[0], departure_time: departure }).departureTime).toBe(
      departure,
    );
  });

  it('returns null for invalid fields', () => {
    const result = parseFlightDetailsResponse({
      ...flightDetails,
      departure_time: 'invalid',
      duration_minutes: 'invalid',
      origin: { ...flightDetails.origin, latitude: 'invalid' },
    });
    expect(result.departureTime).toBeNull();
    expect(result.durationMinutes).toBeNull();
    expect(result.origin?.latitude).toBeNull();
    expect(result.flightNumber).toBe('RO101');
  });

  it('parseFlightDetailsResponse rejects invalid response shapes', () => {
    expect(() => parseFlightDetailsResponse(123)).toThrow('Invalid flight details');
  });
});
