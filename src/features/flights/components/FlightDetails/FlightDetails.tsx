import { useTranslation } from 'react-i18next';

import { DeparturesIcon } from '@components/icons/DeparturesIcon';
import { Card } from '@components/ui/Card/Card';
import { FeedbackMessage } from '@components/ui/FeedbackMessage/FeedbackMessage';
import { Text } from '@components/ui/Text/Text';

import { FlightInfoBox } from './components/FlightInfoBox/FlightInfoBox';
import { FlightRouteMap } from './components/FlightRouteMap/FlightRouteMap';
import { FlightRouteSummary } from './components/FlightRouteSummary/FlightRouteSummary';
import styles from './FlightDetails.module.css';
import { useGetFlightDetails } from '../../hooks/useGetFlightDetails/useGetFlightDetails';

export const FlightDetails = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { t } = useTranslation(['FlightList', 'Common']);
  const { data, error, isFetching, refetch } = useGetFlightDetails(id);

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
            {data?.airline && (
              <Text component="span" tone="muted">
                {data.airline}
              </Text>
            )}
          </span>
        </>
      }
    >
      {isFetching && (
        <Text component="div" data-testid="loading" className={styles.feedback}>
          {t('Common:messages.loading')}
        </Text>
      )}
      {error && !isFetching && (
        <FeedbackMessage
          className={styles.feedback}
          title={t('Common:messages.initialErrorTitle')}
          description={t('FlightDetails.empty')}
          action={{ label: t('Common:actions.retry'), onClick: refetch }}
        />
      )}
      {data && (
        <>
          <FlightRouteSummary origin={data.origin} destination={data.destinationAirport} />
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
            <Text component="p" variant="caption" tone="muted" className={styles.caption}>
              {t('FlightDetails.routeNote')}
            </Text>
          </div>
          <FlightInfoBox flight={data} />
        </>
      )}
    </Card>
  );
};
