import { useMemo, useState } from 'react';

import styles from './FlightList.module.css';
import { PageLayout } from '../../../../components/layout/PageLayout/PageLayout';
import { DataTable, type ColumnDef } from '../../../../components/ui/DataTable/DataTable';
import { DataTableHeader } from '../../../../components/ui/DataTableHeader/DataTableHeader';
import { RefreshControls } from '../../../../components/ui/RefreshControls/RefreshControls';
import { useInterval } from '../../../../hooks/useInterval';
import { dateFormat, timeFormat } from '../../../../utils/date-format';
import { useGetFlights } from '../../hooks/useGetFlights';
import { type Flight, type FlightStatus } from '../../types/flight';
import {
  filterFlights,
  groupFlights,
  type FlightStatusFilter,
  type FlightGroupOption,
} from '../../utils/flight-filters';
import { DATA_TABLE_HEADER_COLORS, getGroupingName } from '../../utils/flight-header';
import { FlightFilters } from '../FlightFilters/FlightFilters';
import { RefreshStatusInfo } from '../RefreshStatusInfo/RefreshStatusInfo';

const statusClasses: Record<FlightStatus, string> = {
  'On Time': styles.onTime,
  Delayed: styles.delayed,
  Cancelled: styles.cancelled,
};

const flightColumns: ColumnDef<Flight>[] = [
  { field: 'flightNumber', headerName: 'Flight' },
  { field: 'destination', headerName: 'Destination' },
  {
    field: 'departureTime',
    headerName: 'Departure',
    renderCell: ({ row }) => (
      <time dateTime={row.departureTime} title={dateFormat.format(new Date(row.departureTime))}>
        {timeFormat.format(new Date(row.departureTime))}
      </time>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) => (
      <span className={`${styles.badge} ${statusClasses[row.status]}`}>{row.status}</span>
    ),
  },
  { field: 'gate', headerName: 'Gate' },
  { field: 'terminal', headerName: 'Terminal' },
  {
    field: 'airline',
    headerName: 'Airline',
    renderCell: ({ row }) => <span className={styles.airlineName}>{row.airline}</span>,
  },
];

const REFRESH_INTERVAL = 30_000;

export const FlightList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<FlightStatusFilter>('all');
  const [grouping, setGrouping] = useState<FlightGroupOption>('terminal');

  const { data: flights, error, isFetching, isLoading, lastUpdated, refetch } = useGetFlights();

  useInterval(refetch, REFRESH_INTERVAL);

  const filtered = useMemo(
    () => filterFlights(flights ?? [], status, search),
    [flights, status, search],
  );
  const groups = useMemo(() => groupFlights(filtered, grouping), [filtered, grouping]);

  const hasFlights = !!flights;
  return (
    <PageLayout>
      <div className={styles.flightBoard}>
        <div className={styles.toolbar}>
          <FlightFilters
            search={search}
            status={status}
            grouping={grouping}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onGroupingChange={setGrouping}
          />
          <RefreshControls
            isFetching={isFetching}
            lastUpdated={lastUpdated}
            hasError={!!error}
            onRefresh={refetch}
          />
        </div>
        <RefreshStatusInfo
          isLoading={isLoading}
          isFetching={isFetching}
          hasFlights={hasFlights}
          error={error}
        />
        {hasFlights && (
          <div aria-busy={isFetching && hasFlights}>
            {groups.size === 0 && (
              <p className={styles.empty}>No flights match the selected filters.</p>
            )}
            {[...groups].map(([name, group], index) => (
              <details className={styles.flightGroup} key={`${grouping}-${name}`} open>
                <DataTableHeader
                  value={grouping === 'airline' ? name.charAt(0) : name}
                  title={getGroupingName(grouping, name)}
                  subtitle={`${group.length} ${group.length === 1 ? 'flight' : 'flights'}`}
                  color={DATA_TABLE_HEADER_COLORS[index % DATA_TABLE_HEADER_COLORS.length]}
                />
                <DataTable rows={group} columns={flightColumns} getRowId={(flight) => flight.id} />
              </details>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
