import styles from './RefreshStatusInfo.module.css';

type RefreshStatusInfoProps = {
  isLoading: boolean;
  isFetching: boolean;
  hasFlights: boolean;
  error: Error | null;
};

// ToDo: this should be general
export const RefreshStatusInfo = ({
  isLoading,
  isFetching,
  hasFlights,
  error,
}: RefreshStatusInfoProps) => {
  // ToDo component: Error Banner
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
          Loading flights... Please wait.
        </div>
      )}
      {isFetching && hasFlights && (
        <div className={styles.update} data-testid="refreshing">
          Refreshing flights...
        </div>
      )}
      {error &&
        !hasFlights &&
        renderError(
          'Unable to load flights.',
          'No flight data is available. Try refreshing again.',
        )}
      {error &&
        hasFlights &&
        renderError(
          'Flight information may be outdated.',
          'The latest refresh failed. Showing the last successful data.',
        )}
    </>
  );
};
