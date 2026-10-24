import type { FlightDto } from '../../types/flight';

export const flights: FlightDto[] = [
  {
    id: '1',
    flight_number: 'RO101',
    destination: 'Paris',
    status: 'On Time',
    gate: '2',
    terminal_number: '1',
    airline: 'TAROM',
    departure_time: '2026-10-24T12:00:00Z',
  },
  {
    id: '2',
    flight_number: 'LH202',
    destination: 'Berlin',
    status: 'Delayed',
    gate: '10',
    terminal_number: '1',
    airline: 'Lufthansa',
    departure_time: '2026-10-24T13:00:00Z',
  },
  {
    id: '3',
    flight_number: 'RO303',
    destination: 'Rome',
    status: 'Cancelled',
    gate: '3',
    terminal_number: '2',
    airline: 'TAROM',
    departure_time: '2026-10-24T14:00:00Z',
  },
];
