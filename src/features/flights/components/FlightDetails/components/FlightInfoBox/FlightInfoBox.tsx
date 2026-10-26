import { useTranslation } from 'react-i18next';

import { InfoItem } from '@components/ui/InfoItem/InfoItem';
import type { FlightDetails } from '@features/flights/types/flight-details.types';

import styles from './FlightInfoBox.module.css';
import { FlightStatusBadge } from '../../../FlightStatusBadge/FlightStatusBadge';

export const FlightInfoBox = ({ flight }: { flight: FlightDetails }) => {
  const { t } = useTranslation(['FlightList', 'Common']);

  return (
    <div className={styles.grid}>
      <div className={styles.row}>
        <div className={styles.cell}>
          <InfoItem
            label={t('FlightList.departure')}
            value={
              flight.departureTime
                ? t('Common:formats.time', { value: flight.departureTime })
                : null
            }
          />
        </div>
        <div className={`${styles.cell} ${styles.gateTerminal}`}>
          <InfoItem label={t('FlightList.gate')} value={flight.gate} />
          <InfoItem label={t('FlightList.terminal')} value={flight.terminal} />
        </div>
        <div className={styles.cell}>
          <InfoItem
            label={t('FlightList.status.label')}
            value={<FlightStatusBadge status={flight.status} />}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.cell}>
          <InfoItem
            label={t('FlightDetails.duration')}
            value={
              flight.durationMinutes
                ? t('FlightDetails.durationValue', {
                    hours: Math.floor(flight.durationMinutes / 60),
                    minutes: flight.durationMinutes % 60,
                  })
                : null
            }
          />
        </div>
        <div className={styles.cell}>
          <InfoItem label={t('FlightDetails.aircraft')} value={flight.aircraft} />
        </div>
        <div className={styles.cell}>
          <InfoItem label={t('FlightDetails.registration')} value={flight.registration} />
        </div>
      </div>
    </div>
  );
};
