import { Text } from '@components/ui/Text/Text';
import type { Airport } from '@features/flights/types/flight-details.types';

import styles from './AirportSummary.module.css';

type AirportSummaryProps = {
  airport: Airport | null;
  destination?: boolean;
};

export const AirportSummary = ({ airport, destination = false }: AirportSummaryProps) => (
  <div className={[styles.airport, destination && styles.destination].filter(Boolean).join(' ')}>
    <strong className={styles.code}>{airport?.code || '-'}</strong>
    <Text className={styles.description}>{airport?.city || '-'}</Text>
    <Text component="small" variant="caption" tone="muted" className={styles.description}>
      {airport?.name || '-'}
    </Text>
  </div>
);
