import styles from './Badge.module.css';

export type BadgeColor = 'green' | 'yellow' | 'red';

type BadgeProps = {
  text: string;
  color: BadgeColor;
};

export const Badge = ({ text, color }: BadgeProps) => (
  <span className={`${styles.badge} ${styles[color]}`}>{text}</span>
);
