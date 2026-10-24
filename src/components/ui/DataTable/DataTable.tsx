import type { Key, ReactNode } from 'react';

import styles from './DataTable.module.css';

export type CellParams<Row> = {
  row: Row;
  field: keyof Row & string;
  value: Row[keyof Row];
};

export type ColumnDef<Row> = {
  field: keyof Row & string;
  headerName: string;
  renderCell?: (params: CellParams<Row>) => ReactNode;
};

type DataTableProps<Row> = {
  rows: Row[];
  columns: ColumnDef<Row>[];
  getRowId: (row: Row) => Key;
  emptyMessage?: string;
};

export const DataTable = <Row,>({
  rows,
  columns,
  getRowId,
  emptyMessage = 'No rows to display.',
}: DataTableProps<Row>) => {
  return (
    <div className={styles.tableScroll} data-testid="data-table">
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.field} scope="col" data-testid={`header-${column.field}`}>
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!rows.length ? (
            <tr>
              <td colSpan={columns.length} data-testid="cell-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowId(row)}>
                {columns.map((column) => {
                  const params = { row, field: column.field, value: row[column.field] };
                  const content = column.renderCell
                    ? column.renderCell(params)
                    : String(params.value ?? '');
                  return (
                    <td key={column.field} data-testid={`cell-${column.field}-${getRowId(row)}`}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
