import { useEffect, useState } from 'react';

import styles from './DateTimeDisplay.module.css';
import { dayFormat, timeFormat } from '../../../utils/date-format';

export const DateTimeDisplay = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <time className={styles.dateDisplay} dateTime={now.toISOString()}>
      <strong>{timeFormat.format(now)}</strong>
      <span>{dayFormat.format(now)}</span>
    </time>
  );
};
