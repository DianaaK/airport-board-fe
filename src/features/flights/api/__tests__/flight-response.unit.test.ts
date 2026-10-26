import { describe, expect, it } from 'vitest';

import { parseFlightsResponse, parseFlightDetailsResponse } from '../flight-response';
import { flightDetails } from '../getFlightDetails/mocks/getFlightDetails.mock';
import { flights } from '../getFlights/mocks/getFlights.mock';

describe('flight response normalization', () => {
  it('parseFlightsResponse skips invalid data', () => {
    const result = parseFlightsResponse([flights[0], { id: 2 }, 'invalid']);
    expect(result).toHaveLength(1);
    expect(result[0].flightNumber).toBe('RO101');
  });

  it('parseFlightsResponse rejects a non-array response', () => {
    expect(() => parseFlightsResponse({ flights })).toThrow('Invalid flight response');
  });

  it('parses flight fields', () => {
    const departureTime = new Date('2026-10-24T12:00:00Z');
    const [result] = parseFlightsResponse([
      {
        ...flights[0],
        id: 101,
        flight_number: 202,
        destination: 303,
        gate: 4,
        terminal_number: 5,
        airline: 6,
        departure_time: departureTime,
      },
    ]);

    expect(result).toMatchObject({
      id: '101',
      flightNumber: '202',
      destination: '303',
      gate: '4',
      terminal: '5',
      airline: '6',
      departureTime,
    });
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

  it('uses null or empty defaults for missing optional details', () => {
    const result = parseFlightDetailsResponse({
      id: '4',
      flight_number: 'RO404',
      status: 'On Time',
      departure_time: null,
      origin: null,
      destination_airport: [],
    });

    expect(result).toMatchObject({
      destination: undefined,
      departureTime: null,
      durationMinutes: null,
      origin: null,
      destinationAirport: null,
    });
  });
});
