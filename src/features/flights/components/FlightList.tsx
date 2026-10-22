import { useMemo, useState } from 'react';

import { flightColumns, flightDateFormat } from './flightColumns';
import { DataTable } from '../../../components/ui/DataTable';
import { Select, type SelectOption } from '../../../components/ui/Select';
import { FLIGHT_STATUSES, type FlightFilters, type FlightGrouping } from '../flight.types';
import { useFlights } from '../hooks/useFlights';
import { filterFlights, groupFlights } from '../utils/selectFlights';

const statusOptions: SelectOption[] = [
  { value: 'all', label: 'All statuses' },
  ...FLIGHT_STATUSES.map((status) => ({ value: status, label: status })),
];

const groupingOptions: SelectOption[] = [
  { value: 'terminal', label: 'Terminal' },
  { value: 'gate', label: 'Gate' },
  { value: 'airline', label: 'Airline' },
];

export function FlightList() {
  const { data: flights, error, isFetching, isLoading, lastUpdated, refetch } = useFlights();
  const [status, setStatus] = useState<FlightFilters['status']>('all');
  const [grouping, setGrouping] = useState<FlightGrouping>('terminal');
  const filtered = useMemo(() => filterFlights(flights ?? [], { status }), [flights, status]);
  const groups = useMemo(() => groupFlights(filtered, grouping), [filtered, grouping]);
  const hasFlights = flights !== undefined;

  const handleStatusChange = (value: string) => {
    setStatus(value as FlightFilters['status']);
  };

  const handleGroupingChange = (value: string) => {
    setGrouping(value as FlightGrouping);
  };

  return (
    <>
      <h1>Departures</h1>
      <p>All times in Bucharest local time</p>
      {!import.meta.env.VITE_API_URL && <p className="demo">Demo data · Local sample schedule</p>}
      <div className="toolbar">
        <Select
          label="Status"
          value={status}
          options={statusOptions}
          onChange={handleStatusChange}
        />
        <Select
          label="Group by"
          value={grouping}
          options={groupingOptions}
          onChange={handleGroupingChange}
        />
        <button disabled={isFetching} onClick={() => void refetch()}>
          {isFetching ? 'Updating…' : 'Refresh flights'}
        </button>
      </div>
      <div className="update" role="status" aria-live="polite">
        {isLoading && <p>Loading flights for the first time…</p>}
        {isFetching && hasFlights && <p>Refreshing. Showing the last successful data.</p>}
        {lastUpdated && (
          <p>
            Last successfully updated:{' '}
            <time dateTime={lastUpdated.toISOString()}>{flightDateFormat.format(lastUpdated)}</time>
          </p>
        )}
        <p>Automatically refreshes every 30 seconds.</p>
      </div>
      {error && (
        <div className="error" role="alert">
          <strong>
            {hasFlights ? 'Data may be stale. Refresh failed.' : 'Unable to load flights.'}
          </strong>
          <p>{error.message}</p>
          <p>
            {hasFlights
              ? 'Showing the last successful data until a refresh succeeds.'
              : 'No flight data is available. Try refreshing again.'}
          </p>
        </div>
      )}
      {hasFlights && (
        <div aria-busy={isFetching && hasFlights}>
          <p>{filtered.length} flights</p>
          {groups.size === 0 && <p className="empty">No flights match the selected filters.</p>}
          {[...groups].map(([name, group]) => (
            <section key={name} aria-label={`${grouping} ${name}`}>
              <h2>
                {grouping === 'terminal'
                  ? `Terminal ${name}`
                  : grouping === 'gate'
                    ? `Gate ${name}`
                    : name}
              </h2>
              <DataTable
                rows={group}
                columns={flightColumns}
                getRowId={(flight) => flight.id}
                label={`${grouping} ${name} departures`}
              />
            </section>
          ))}
        </div>
      )}
    </>
  );
}
