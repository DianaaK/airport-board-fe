import styles from './DataStatus.module.css';

type DataStatusProps = {
  isLoading: boolean;
  isFetching: boolean;
  hasData: boolean;
  error: Error | null;
  messages?: Partial<typeof defaultMessages>;
};

const defaultMessages = {
  loading: 'Loading data... Please wait.',
  refreshing: 'Refreshing data...',
  initialErrorTitle: 'Unable to load data.',
  initialErrorDescription: 'No data is available. Try refreshing again.',
  staleTitle: 'Data may be outdated.',
  staleDescription: 'The latest refresh failed. Showing the last successful data.',
};

export const DataStatus = ({
  isLoading,
  isFetching,
  hasData,
  error,
  messages,
}: DataStatusProps) => {
  const text = { ...defaultMessages, ...messages };

  const renderError = (title: string, description: string) => (
    <div className={styles.error}>
      <strong data-testid="error-title">{title}</strong>
      <p data-testid="error-text">{description}</p>
    </div>
  );

  return (
    <>
      {isLoading && (
        <div className={styles.update} data-testid="loading">
          {text.loading}
        </div>
      )}
      {isFetching && hasData && (
        <div className={styles.update} data-testid="refreshing">
          {text.refreshing}
        </div>
      )}
      {error && !hasData && renderError(text.initialErrorTitle, text.initialErrorDescription)}
      {error && hasData && renderError(text.staleTitle, text.staleDescription)}
    </>
  );
};
