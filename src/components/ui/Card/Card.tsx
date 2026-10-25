import type { ReactNode } from 'react';

import { useTranslation } from 'react-i18next';

import styles from './Card.module.css';

type CardProps = {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
};

export const Card = ({ title, onClose, children }: CardProps) => {
  const { t } = useTranslation('Common');
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t('actions.close')}
        >
          ×
        </button>
      </header>
      {children}
    </section>
  );
};
