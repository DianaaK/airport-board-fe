import styles from './FeedbackMessage.module.css';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';

type FeedbackMessageProps = {
  title?: string;
  description?: string;
  className?: string;
  action?: { label: string; onClick: () => void };
};

export const FeedbackMessage = ({
  title,
  description,
  className,
  action,
}: FeedbackMessageProps) => (
  <div className={className}>
    {title && <strong data-testid="error-title">{title}</strong>}
    {description && (
      <Text component="p" data-testid="error-text">
        {description}
      </Text>
    )}
    {action && (
      <Button size="small" className={styles.button} onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
);
