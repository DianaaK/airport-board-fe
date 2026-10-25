import { useTranslation } from 'react-i18next';

import { DeparturesIcon } from '@components/icons/DeparturesIcon';
import { Card } from '@components/ui/Card/Card';

import { FlightInfoBox } from './components/FlightInfoBox/FlightInfoBox';
import { FlightRouteMap } from './components/FlightRouteMap/FlightRouteMap';
import styles from './FlightDetails.module.css';
import { useGetFlightDetails } from '../../hooks/useGetFlightDetails/useGetFlightDetails';

export const FlightDetails = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { t } = useTranslation(['FlightList', 'Common']);
  const { data, error, isLoading, refetch } = useGetFlightDetails(id);

  return (
    <Card
      onClose={onClose}
      title={
        <>
          <span className={styles.airlineMark}>
            <DeparturesIcon />
          </span>
          <span className={styles.identity}>
            {data?.flightNumber ?? t('FlightDetails.heading')}
            {data?.airline && <span>{data.airline}</span>}
          </span>
        </>
      }
    >
      {isLoading && (
        <p className={styles.feedback} data-testid="loading">
          {t('Common:messages.loading')}
        </p>
      )}
      {!isLoading && !data && (
        <>
          <div className={styles.feedback}>
            {error ? (
              <>
                <strong data-testid="error-title">{t('Common:messages.initialErrorTitle')}</strong>
                <p>{t('Common:messages.initialErrorDescription')}</p>
              </>
            ) : (
              <p>{t('FlightDetails.empty')}</p>
            )}
          </div>
          <button className={styles.retry} onClick={refetch}>
            {t('Common:actions.retry')}
          </button>
        </>
      )}
      {data && (
        <>
          <div className={styles.airports}>
            <div>
              <strong>{data.origin?.code || '—'}</strong>
              <span>{data.origin?.city || '—'}</span>
              <small>{data.origin?.name || '—'}</small>
            </div>
            <div className={styles.routeLine}>
              <DeparturesIcon />
            </div>
            <div>
              <strong>{data.destinationAirport?.code || '—'}</strong>
              <span>{data.destinationAirport?.city || '—'}</span>
              <small>{data.destinationAirport?.name || '—'}</small>
            </div>
          </div>
          <div className={styles.tabs} role="tablist">
            <button role="tab" id="route-tab" className={styles.activeTab}>
              {t('FlightDetails.route')}
            </button>
            <button role="tab" id="terminal-tab" disabled>
              {t('FlightDetails.terminalMap')}
            </button>
          </div>
          <div role="tabpanel" id="route-panel">
            <FlightRouteMap origin={data.origin} destination={data.destinationAirport} />
            <p className={styles.caption}>{t('FlightDetails.routeNote')}</p>
          </div>
          <FlightInfoBox flight={data} />
        </>
      )}
    </Card>
  );
};
