import styles from './RefreshStatusInfo.module.css';

type RefreshStatusInfoProps = {
  isLoading: boolean;
  isFetching: boolean;
  hasFlights: boolean;
  error: Error | null;
};

export const RefreshStatusInfo = ({
  isLoading,
  isFetching,
  hasFlights,
  error,
}: RefreshStatusInfoProps) => {
  const renderError = (title: string, description: string) => (
    <div className={styles.error} role="alert">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );

  return (
    <>
      {isLoading && (
        <div className={styles.update} role="status">
          Loading flights... Please wait.
        </div>
      )}
      {isFetching && hasFlights && (
        <div className={styles.update} role="status">
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
