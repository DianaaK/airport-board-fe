import { useTranslation } from 'react-i18next';

import type { FlightStatus } from '@features/flights/types/flight.types';

import styles from './FlightStatusBadge.module.css';

const FLIGHT_STATUS_COLORS = {
  'On Time': 'green',
  Delayed: 'yellow',
  Cancelled: 'red',
};

export const FlightStatusBadge = ({ status }: { status: FlightStatus }) => {
  const { t } = useTranslation('FlightList');

  return (
    <span className={`${styles.badge} ${styles[FLIGHT_STATUS_COLORS[status]]}`}>
      {t(`FlightList.status.options.${status}`)}
    </span>
  );
};
