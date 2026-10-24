import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import styles from './DateTimeDisplay.module.css';

export const DateTimeDisplay = () => {
  const { t } = useTranslation('Common');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <time className={styles.dateDisplay} dateTime={now.toISOString()}>
      <strong>{t('formats.time', { value: now })}</strong>
      <span>{t('formats.date', { value: now })}</span>
    </time>
  );
};
