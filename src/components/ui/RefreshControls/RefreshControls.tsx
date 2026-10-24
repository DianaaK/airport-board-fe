import styles from './RefreshControls.module.css';
import { RefreshIcon } from '../../icons/RefreshIcon';
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
}: RefreshControlsProps) => {
  const getUpdatedTime = () => {
    if (lastUpdated) {
      return `${hasError ? 'Last updated' : 'Updated'} ${lastUpdated.toLocaleTimeString('en-GB', { timeZone: 'Europe/Bucharest' })}`;
    }
    if (!lastUpdated && !hasError) {
      return 'Awaiting update';
    }
    if (!lastUpdated && hasError) {
      return 'Update failed';
    }
  };

  return (
    <div className={styles.actions}>
      <span className={`${styles.status} ${hasError ? styles.stale : ''}`} role="status">
        <span className={styles.dot} />
        {getUpdatedTime()}
      </span>
      <Button
        data-testid="refresh-button"
        size="small"
        className={styles.refreshButton}
        disabled={isFetching}
        onClick={onRefresh}
        icon={<RefreshIcon />}
      >
        {isFetching ? 'Refreshing...' : 'Refresh'}
      </Button>
    </div>
  );
};
