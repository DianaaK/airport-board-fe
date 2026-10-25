import { useTranslation } from 'react-i18next';

import styles from './DataStatus.module.css';
import { FeedbackMessage } from '../FeedbackMessage/FeedbackMessage';
import { Text } from '../Text/Text';

type DataStatusProps = {
  isLoading: boolean;
  isFetching: boolean;
  hasData: boolean;
  error: Error | null;
};

export const DataStatus = ({ isLoading, isFetching, hasData, error }: DataStatusProps) => {
  const { t } = useTranslation('Common', { keyPrefix: 'messages' });

  return (
    <>
      {isLoading && (
        <Text component="div" className={styles.update} data-testid="loading">
          {t('loading')}
        </Text>
      )}
      {isFetching && hasData && (
        <Text component="div" className={styles.update} data-testid="refreshing">
          {t('refreshing')}
        </Text>
      )}
      {error && !hasData && (
        <FeedbackMessage
          className={styles.error}
          title={t('initialErrorTitle')}
          description={t('initialErrorDescription')}
        />
      )}
      {error && hasData && (
        <FeedbackMessage
          className={styles.error}
          title={t('staleTitle')}
          description={t('staleDescription')}
        />
      )}
    </>
  );
};
