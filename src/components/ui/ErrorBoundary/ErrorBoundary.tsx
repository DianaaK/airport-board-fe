import { useTranslation } from 'react-i18next';

import styles from './ErrorBoundary.module.css';
import { Button } from '../Button/Button';

export const ErrorBoundary = () => {
  const { t } = useTranslation('Common');

  return (
    <section className={styles.error}>
      <h1>{t('messages.unexpectedError')}</h1>
      <p>{t('messages.pageError')}</p>
      <Button onClick={() => window.location.reload()}>{t('actions.reload')}</Button>
    </section>
  );
};
