import type { ColumnDef } from '../../../components/ui/DataTable';
import type { Flight } from '../flight.types';

const time = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Bucharest',
});

export const flightDateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'medium',
  timeZone: 'Europe/Bucharest',
});

export const flightColumns: readonly ColumnDef<Flight>[] = [
  {
    field: 'departureTime',
    headerName: 'Departure',
    renderCell: ({ row }) => (
      <time
        dateTime={row.departureTime}
        title={flightDateFormat.format(new Date(row.departureTime))}
      >
        {time.format(new Date(row.departureTime))}
      </time>
    ),
  },
  {
    field: 'flightNumber',
    headerName: 'Flight',
    renderCell: ({ row }) => (
      <>
        <strong>{row.flightNumber}</strong>
        <small>{row.airline}</small>
      </>
    ),
  },
  { field: 'destination', headerName: 'Destination' },
  {
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) => (
      <span className={`badge ${row.status.toLowerCase().replace(' ', '-')}`}>{row.status}</span>
    ),
  },
  { field: 'gate', headerName: 'Gate' },
  { field: 'terminal', headerName: 'Terminal' },
];
