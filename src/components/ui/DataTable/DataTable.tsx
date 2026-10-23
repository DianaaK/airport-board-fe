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
  rows: readonly Row[];
  columns: readonly ColumnDef<Row>[];
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
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.field} scope="col">
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowId(row)}>
                {columns.map((column) => {
                  const params = { row, field: column.field, value: row[column.field] };
                  const content = column.renderCell
                    ? column.renderCell(params)
                    : String(params.value ?? '');
                  return <td key={column.field}>{content}</td>;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
