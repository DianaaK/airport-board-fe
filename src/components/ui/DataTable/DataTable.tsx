import { memo, type Key, type ReactNode } from 'react';

import { useTranslation } from 'react-i18next';

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
  emptyMessage?: string;
  emptyCellContent?: string;
  getRowId: (row: Row) => Key;
  onRowClick?: (row: Row) => void;
};

const DataTableComponent = <Row,>({
  rows,
  columns,
  emptyMessage,
  emptyCellContent = '-',
  getRowId,
  onRowClick,
}: DataTableProps<Row>) => {
  const { t } = useTranslation('Common', { keyPrefix: 'messages' });

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
                {emptyMessage ?? t('emptyRows')}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowId(row)}
                className={onRowClick ? styles.selectable : undefined}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => {
                  const params = { row, field: column.field, value: row[column.field] };
                  const content = column.renderCell
                    ? column.renderCell(params)
                    : params.value?.toString();
                  return (
                    <td key={column.field} data-testid={`cell-${column.field}-${getRowId(row)}`}>
                      {content ?? emptyCellContent}
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

export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;
