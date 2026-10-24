import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('Common');

  const getUpdatedTime = () => {
    if (lastUpdated) {
      return `${hasError ? t('labels.lastUpdated') : t('labels.updated')} ${t('formats.timeSeconds', { value: lastUpdated })}`;
    }
    if (!lastUpdated && !hasError) {
      return t('messages.awaitingUpdate');
    }
    if (!lastUpdated && hasError) {
      return t('messages.updateFailed');
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
        {isFetching ? t('messages.refreshPending') : t('actions.refresh')}
      </Button>
    </div>
  );
};
