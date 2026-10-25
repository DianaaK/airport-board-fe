import type { ReactNode } from 'react';

import styles from './InfoItem.module.css';
import { Text } from '../Text/Text';

type InfoItemProps = {
  label: string;
  value: string | ReactNode;
};

export const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className={styles.item}>
    <Text variant="label" tone="muted">
      {label}
    </Text>
    <Text variant="label" className={styles.value}>
      {value ?? '—'}
    </Text>
  </div>
);
