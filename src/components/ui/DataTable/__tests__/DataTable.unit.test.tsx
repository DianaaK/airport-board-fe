import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DataTable, type ColumnDef } from '../DataTable';

type Row = { id: number; name: string; count?: number | null };

const getRowId = (row: Row) => row.id;
const columns: ColumnDef<Row>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'count', headerName: 'Count' },
];
const rows = [
  { id: 1, name: 'First', count: 0 },
  { id: 2, name: 'Second', count: 2 },
];

describe('DataTable', () => {
  it('renders column headers and row values, including zero', () => {
    render(<DataTable columns={columns} rows={rows} getRowId={getRowId} />);
    expect(screen.getAllByTestId(/header-/).map((header) => header.textContent)).toEqual([
      'Name',
      'Count',
    ]);
    expect(screen.getAllByTestId(/cell-/).map((cell) => cell.textContent)).toEqual([
      'First',
      '0',
      'Second',
      '2',
    ]);
  });

  it('passes the row, field and value to a custom cell renderer', () => {
    const renderCell = vi.fn(({ value }) => <strong>{value} flights</strong>);
    const columnsWithRenderer = [
      {
        field: 'count' as const,
        headerName: 'Count',
        renderCell,
      },
    ];
    render(<DataTable columns={columnsWithRenderer} rows={rows} getRowId={getRowId} />);
    expect(renderCell).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('cell-count-1')).toHaveTextContent('0 flights');
  });

  it('renders a custom empty message when there are no rows', () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        getRowId={getRowId}
        emptyMessage="No data displayed."
      />,
    );
    expect(screen.getByTestId('cell-empty')).toHaveTextContent('No data displayed.');
  });

  it('renders an empty cell for null or undefined values', () => {
    render(
      <DataTable
        columns={columns}
        rows={[
          { id: 1, name: 'First', count: null },
          { id: 1, name: 'First' },
        ]}
        getRowId={getRowId}
      />,
    );
    expect(screen.getAllByTestId(/cell-count/).map((cell) => cell.textContent)).toEqual(['-', '-']);
  });
});
