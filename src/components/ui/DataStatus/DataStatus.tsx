import { useTranslation } from 'react-i18next';

import styles from './DataStatus.module.css';

type DataStatusProps = {
  isLoading: boolean;
  isFetching: boolean;
  hasData: boolean;
  error: Error | null;
};

export const DataStatus = ({ isLoading, isFetching, hasData, error }: DataStatusProps) => {
  const { t } = useTranslation('Common', { keyPrefix: 'messages' });

  const renderError = (title: string, description: string) => (
    <div className={styles.error}>
      <strong data-testid="error-title">{title}</strong>
      <p data-testid="error-text">{description}</p>
    </div>
  );

  return (
    <>
      {isLoading && (
        <div className={styles.update} data-testid="loading">
          {t('loading')}
        </div>
      )}
      {isFetching && hasData && (
        <div className={styles.update} data-testid="refreshing">
          {t('refreshing')}
        </div>
      )}
      {error && !hasData && renderError(t('initialErrorTitle'), t('initialErrorDescription'))}
      {error && hasData && renderError(t('staleTitle'), t('staleDescription'))}
    </>
  );
};
