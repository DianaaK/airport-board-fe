import { useMemo, useState } from 'react';

import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import styles from './FlightList.module.css';
import { PageLayout } from '../../../../components/layout/PageLayout/PageLayout';
import { DataStatus } from '../../../../components/ui/DataStatus/DataStatus';
import { DataTable, type ColumnDef } from '../../../../components/ui/DataTable/DataTable';
import { DataTableHeader } from '../../../../components/ui/DataTableHeader/DataTableHeader';
import { RefreshControls } from '../../../../components/ui/RefreshControls/RefreshControls';
import { useInterval } from '../../../../hooks/useInterval/useInterval';
import { useGetFlights } from '../../hooks/useGetFlights';
import { type Flight, type FlightStatus } from '../../types/flight';
import {
  filterFlights,
  groupFlights,
  type FlightStatusFilter,
  type FlightGroupOption,
} from '../../utils/flight-filters';
import { FlightFilters } from '../FlightFilters/FlightFilters';

const statusClasses: Record<FlightStatus, string> = {
  'On Time': styles.onTime,
  Delayed: styles.delayed,
  Cancelled: styles.cancelled,
};

const DATA_TABLE_HEADER_COLORS = ['yellow', 'blue', 'green', 'purple', 'pink'] as const;

const getFlightRowId = (flight: Flight) => flight.id;

const getFlightColumns = (
  t: TFunction<'FlightList', 'FlightList'>,
  tCommon: TFunction<'Common'>,
): ColumnDef<Flight>[] => {
  return [
    { field: 'flightNumber', headerName: t('flight') },
    { field: 'destination', headerName: t('destination') },
    {
      field: 'departureTime',
      headerName: t('departure'),
      renderCell: ({ row }) => {
        if (!row.departureTime) {
          return null;
        }
        return (
          <time
            dateTime={row.departureTime}
            title={tCommon('formats.date', {
              value: new Date(row.departureTime),
              formatParams: { value: { format: { dateStyle: 'medium', timeStyle: 'medium' } } },
            })}
          >
            {tCommon('formats.time', { value: new Date(row.departureTime) })}
          </time>
        );
      },
    },
    {
      field: 'status',
      headerName: t('status.label'),
      renderCell: ({ row }) => (
        <span className={`${styles.badge} ${statusClasses[row.status]}`}>
          {t(`status.options.${row.status}`)}
        </span>
      ),
    },
    { field: 'gate', headerName: t('gate') },
    { field: 'terminal', headerName: t('terminal') },
    {
      field: 'airline',
      headerName: t('airline'),
      renderCell: ({ row }) =>
        row.airline ? <span className={styles.airlineName}>{row.airline}</span> : null,
    },
  ];
};

const REFRESH_INTERVAL = 30_000;

export const FlightList = () => {
  const { t } = useTranslation('FlightList', { keyPrefix: 'FlightList' });
  const { t: tCommon } = useTranslation('Common');

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
  const flightColumns = useMemo(() => getFlightColumns(t, tCommon), [t, tCommon]);

  const getGroupingName = (grouping: FlightGroupOption, value: string) => {
    switch (grouping) {
      case 'terminal':
        return `${t('terminal')} ${value}`;
      case 'gate':
        return `${t('gate')} ${value}`;
      default:
        return value;
    }
  };

  const hasData = flights !== undefined;
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
        <DataStatus isLoading={isLoading} isFetching={isFetching} hasData={hasData} error={error} />
        {hasData && (
          <div aria-busy={isFetching && hasData}>
            {groups.size === 0 && (
              <p className={styles.empty} data-testid="empty-message">
                {t('emptyFlights')}
              </p>
            )}
            {[...groups].map(([name, group], index) => (
              <details
                className={styles.flightGroup}
                key={`${grouping}-${name}`}
                data-testid={`flight-group-${grouping}-${name}`}
                open
              >
                <DataTableHeader
                  value={grouping === 'airline' ? name.charAt(0) : name}
                  title={getGroupingName(grouping, name)}
                  subtitle={t('flight', { count: group.length })}
                  color={DATA_TABLE_HEADER_COLORS[index % DATA_TABLE_HEADER_COLORS.length]}
                />
                <DataTable rows={group} columns={flightColumns} getRowId={getFlightRowId} />
              </details>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
