import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { ENV_API_URL } from '../../../../../config/environment';
import { server } from '../../../../../test/server';
import { flights } from '../../../api/mocks/flights';
import { FlightList } from '../FlightList';

beforeEach(() => {
  server.use(http.get(ENV_API_URL, () => HttpResponse.json(flights)));
});

describe('FlightList integration', () => {
  it('shows loading, then renders flights grouped by terminal with counts', async () => {
    render(<FlightList />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByTestId('refresh-button')).toBeDisabled();

    await screen.findByTestId('cell-flightNumber-1');
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();

    expect(screen.getAllByTestId('data-table-header')).toHaveLength(2);
    expect(screen.getAllByTestId('group-title')[0]).toHaveTextContent('Terminal 1');
    expect(screen.getAllByTestId('group-subtitle')[0]).toHaveTextContent('2 flights');
    expect(screen.getAllByTestId('group-title')[1]).toHaveTextContent('Terminal 2');
    expect(screen.getAllByTestId('group-subtitle')[1]).toHaveTextContent('1 flight');
    expect(screen.getByTestId('refresh-button')).toBeEnabled();
  });

  it('combines search and status filters, and shows an empty state for no matches', async () => {
    const user = userEvent.setup();
    render(<FlightList />);

    await screen.findByTestId('cell-flightNumber-1');
    const search = screen.getByRole('searchbox');
    await user.type(search, '  tarom  ');
    expect(screen.queryByText('LH202')).not.toBeInTheDocument();
    expect(screen.getByText('RO303')).toBeInTheDocument();

    await user.selectOptions(screen.getAllByRole('combobox')[0], 'On Time');
    expect(screen.queryByText('RO303')).not.toBeInTheDocument();
    expect(screen.getByText('RO101')).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'no matching destination');
    expect(screen.getByTestId('empty-message')).toBeInTheDocument();
  });

  it('regroups flights by gate and airline', async () => {
    const user = userEvent.setup();
    render(<FlightList />);

    await screen.findByTestId('cell-flightNumber-1');
    const grouping = screen.getByTestId('grouping-select');
    await user.selectOptions(grouping, 'gate');
    expect(screen.getAllByTestId('group-title').map((title) => title.textContent)).toEqual([
      'Gate 2',
      'Gate 3',
      'Gate 10',
    ]);
    expect(
      within(screen.getByTestId('flight-group-gate-10')).getByTestId('cell-flightNumber-2'),
    ).toBeInTheDocument();
    await user.selectOptions(grouping, 'airline');
    expect(screen.getAllByTestId('data-table')).toHaveLength(2);
    expect(screen.getAllByTestId('group-title').map((title) => title.textContent)).toEqual([
      'Lufthansa',
      'TAROM',
    ]);
    const taromGroup = screen.getByTestId('flight-group-airline-TAROM');
    expect(within(taromGroup).getByTestId('group-subtitle')).toHaveTextContent('2 flights');
  });

  it('refreshes manually while retaining visible data and preventing duplicate refreshes', async () => {
    const user = userEvent.setup();
    render(<FlightList />);
    await screen.findByTestId('cell-flightNumber-1');

    let releaseResolve!: () => void;
    const responseReady = new Promise<void>((resolve) => {
      releaseResolve = resolve;
    });
    server.use(
      http.get(ENV_API_URL, async () => {
        await responseReady;
        return HttpResponse.json([{ ...flights[0], destination: 'Madrid' }]);
      }),
    );
    await user.click(screen.getByTestId('refresh-button'));
    expect(screen.getByTestId('refreshing')).toBeInTheDocument();
    expect(screen.getByTestId('refresh-button')).toBeDisabled();
    expect(screen.getByTestId('cell-destination-1')).toHaveTextContent('Paris');

    releaseResolve();
    await waitFor(() =>
      expect(screen.getByTestId('cell-destination-1')).toHaveTextContent('Madrid'),
    );
    expect(screen.getByTestId('cell-destination-1')).not.toHaveTextContent('Paris');
    expect(screen.queryByTestId('cell-flightNumber-2')).not.toBeInTheDocument();
  });

  it('retains flights after refresh failure and clears the warning after recovery', async () => {
    const user = userEvent.setup();
    render(<FlightList />);
    await screen.findByTestId('cell-flightNumber-1');

    server.use(http.get(ENV_API_URL, () => new HttpResponse(null, { status: 503 })));
    await user.click(screen.getByTestId('refresh-button'));
    expect(await screen.findByTestId('error-title')).toHaveTextContent(
      'Flight information may be outdated.',
    );
    expect(screen.getByTestId('cell-flightNumber-1')).toBeInTheDocument();
    server.use(http.get(ENV_API_URL, () => HttpResponse.json(flights)));
    await user.click(screen.getByTestId('refresh-button'));
    await waitFor(() => expect(screen.queryByTestId('error-title')).not.toBeInTheDocument());
  });

  it('allows recovery from an initial request failure', async () => {
    const user = userEvent.setup();
    server.use(http.get(ENV_API_URL, () => HttpResponse.error()));
    render(<FlightList />);

    expect(await screen.findByTestId('error-title')).toHaveTextContent('Unable to load flights.');
    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();

    server.use(http.get(ENV_API_URL, () => HttpResponse.json(flights)));
    await user.click(screen.getByTestId('refresh-button'));
    await screen.findByTestId('cell-flightNumber-1');
    expect(screen.queryByTestId('error-title')).not.toBeInTheDocument();
  });

  it('handles a successful empty response', async () => {
    server.use(http.get(ENV_API_URL, () => HttpResponse.json([])));
    render(<FlightList />);
    expect(await screen.findByTestId('empty-message')).toBeInTheDocument();
    expect(screen.queryByTestId('error-title')).not.toBeInTheDocument();
  });
});
