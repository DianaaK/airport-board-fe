import styles from './RefreshControls.module.css';
import { Button } from '../Button/Button';

export type RefreshControlsProps = {
  isFetching: boolean;
  lastUpdated: Date | null;
  hasError?: boolean;
  onRefresh: () => void | Promise<void>;
  onOpenSettings?: () => void;
};

export const RefreshControls = ({
  isFetching,
  lastUpdated,
  hasError = false,
  onRefresh,
}: RefreshControlsProps) => (
  <div className={styles.actions}>
    <span className={`${styles.status} ${hasError ? styles.stale : ''}`} role="status">
      <span className={styles.dot} />
      {lastUpdated ? (
        <>
          {hasError ? 'Last updated' : 'Updated'}{' '}
          <time dateTime={lastUpdated.toISOString()}>
            {lastUpdated.toLocaleTimeString('en-GB', { timeZone: 'Europe/Bucharest' })}
          </time>
        </>
      ) : hasError ? (
        'Update failed'
      ) : (
        'Awaiting update'
      )}
    </span>
    <Button
      size="small"
      className={styles.refreshButton}
      disabled={isFetching}
      onClick={onRefresh}
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M20 7v5h-5M4 17v-5h5M6 7a7 7 0 0 1 12-1l2 3M4 15l2 3a7 7 0 0 0 12-1" />
        </svg>
      }
    >
      {isFetching ? 'Refreshing...' : 'Refresh'}
    </Button>
  </div>
);
