import type { FlightStatus, Flight } from '@features/flights/types/flight.types';

export type FlightGroupOption = 'terminal' | 'gate' | 'airline';
export type FlightStatusFilter = FlightStatus | 'all';
export type FlightSelector = (flight: Flight) => string | undefined;

const isSearchMatch = (flight: Flight, search: string) => {
  const searchValue = search.trim().toLowerCase();
  return [flight.flightNumber, flight.destination, flight.airline].some(
    (value) => value && value.toLowerCase().includes(searchValue),
  );
};

export const filterFlights = (flights: Flight[], status: FlightStatusFilter, search?: string) => {
  const searchValue = search?.trim().toLowerCase() ?? '';
  return flights.filter(
    (flight) =>
      (status === 'all' || flight.status === status) &&
      (!searchValue || isSearchMatch(flight, searchValue)),
  );
};

const selectors: Record<FlightGroupOption, FlightSelector> = {
  terminal: (flight) => flight.terminal,
  gate: (flight) => flight.gate,
  airline: (flight) => flight.airline,
};

export const groupFlights = (flights: Flight[], grouping: FlightGroupOption) => {
  const groups = new Map<string, Flight[]>();
  for (const flight of flights) {
    const flightKey = selectors[grouping](flight);
    if (!flightKey) {
      continue;
    }
    const group = groups.get(flightKey);
    if (group) {
      group.push(flight);
    } else {
      groups.set(flightKey, [flight]);
    }
  }
  return new Map([...groups].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })));
};
