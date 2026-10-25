import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/test/server';
import { flightDetails } from '@features/flights/api/getFlightDetails/mocks/getFlightDetails.mock';
import { flights } from '@features/flights/api/getFlights/mocks/getFlights.mock';
import { FLIGHTS_ENDPOINTS } from '@features/flights/config/endpoints';
import type { Airport } from '@features/flights/types/flight-details.types';

import { FlightsPage } from '../FlightsPage';

vi.mock(
  '@features/flights/components/FlightDetails/components/FlightRouteMap/FlightRouteMap',
  () => ({
    FlightRouteMap: ({ origin, destination }: { origin: Airport; destination: Airport }) => (
      <div data-testid="flight-route-map">
        {origin.code} to {destination.code}
      </div>
    ),
  }),
);

beforeEach(() => {
  server.use(
    http.get(FLIGHTS_ENDPOINTS.getAll(), () => HttpResponse.json(flights)),
    http.get(FLIGHTS_ENDPOINTS.getById('1'), () => HttpResponse.json(flightDetails)),
  );
});

describe('FlightsPage integration', () => {
  it('opens details, keeps them open when filtering hides the row, and closes the panel', async () => {
    const user = userEvent.setup();
    render(<FlightsPage />);
    expect(screen.queryByTestId('details-panel')).not.toBeInTheDocument();

    await user.click(await screen.findByTestId('cell-flightNumber-1'));
    const panel = screen.getByTestId('details-panel');
    expect(await within(panel).findByRole('heading', { name: /RO101/ })).toBeInTheDocument();
    expect(within(panel).getByTestId('flight-route-map')).toHaveTextContent('CLJ to CDG');

    await user.type(screen.getByRole('searchbox'), 'LH202');
    expect(screen.queryByTestId('cell-flightNumber-1')).not.toBeInTheDocument();
    expect(within(panel).getByRole('heading', { name: /RO101/ })).toBeInTheDocument();

    await user.click(within(panel).getByRole('button', { name: 'Close' }));
    expect(screen.queryByTestId('details-panel')).not.toBeInTheDocument();
    expect(screen.getByTestId('cell-flightNumber-2')).toBeInTheDocument();
  });
});
