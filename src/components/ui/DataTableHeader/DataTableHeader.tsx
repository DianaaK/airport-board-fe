import styles from './DataTableHeader.module.css';
import type { DATA_TABLE_HEADER_COLORS } from '../../../features/flights/utils/flight-header';

type DataTableHeaderProps = {
  value: string | number;
  title: string;
  subtitle: string;
  color?: (typeof DATA_TABLE_HEADER_COLORS)[number];
};

export const DataTableHeader = ({
  value,
  title,
  subtitle,
  color = 'yellow',
}: DataTableHeaderProps) => (
  <summary className={styles.header} data-testid="data-table-header">
    <span className={`${styles.mark} ${styles[color]}`}>{value}</span>
    <span className={styles.groupTitle}>
      <strong data-testid="group-title">{title}</strong>
      <small data-testid="group-subtitle">{subtitle}</small>
    </span>
    <span className={styles.groupChevron}>⌃</span>
  </summary>
);
