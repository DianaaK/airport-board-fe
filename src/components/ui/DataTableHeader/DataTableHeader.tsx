import styles from './DataTableHeader.module.css';

type DataTableHeaderProps = {
  value: string | number;
  title: string;
  subtitle: string;
  color?: 'yellow' | 'blue' | 'green' | 'purple' | 'pink';
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
