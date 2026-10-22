import type { FlightFilters, Flight, FlightGrouping } from '../flight.types';

export function filterFlights(flights: Flight[], filters: FlightFilters) {
  return flights.filter((flight) => filters.status === 'all' || flight.status === filters.status);
}

const selectors: Record<FlightGrouping, (flight: Flight) => string> = {
  terminal: (flight) => flight.terminal,
  gate: (flight) => flight.gate,
  airline: (flight) => flight.airline,
};

export function groupFlights(flights: Flight[], grouping: FlightGrouping) {
  const groups = new Map<string, Flight[]>();
  for (const flight of flights) {
    const key = selectors[grouping](flight);
    const group = groups.get(key);
    if (group) group.push(flight);
    else groups.set(key, [flight]);
  }
  return new Map([...groups].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })));
}
