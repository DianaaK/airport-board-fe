import type { ReactNode } from 'react';

import { useTranslation } from 'react-i18next';

import styles from './FlightInfoBox.module.css';
import { Badge } from '../../../../../../components/ui/Badge/Badge';
import type { FlightDetails } from '../../../../types/flight-details';
import { FLIGHT_STATUS_COLORS } from '../../../../utils/flight-status';

const renderCell = (label: string, value: ReactNode) => (
  <div className={styles.section}>
    <span className={styles.label}>{label}</span>
    <div className={styles.value}>{value}</div>
  </div>
);

export const FlightInfoBox = ({ flight }: { flight: FlightDetails }) => {
  const { t } = useTranslation(['FlightList', 'Common']);
  const departure = flight.departureTime ? new Date(flight.departureTime) : undefined;

  return (
    <div className={styles.grid}>
      <div className={styles.cell}>
        {renderCell(
          t('FlightList.departure'),
          departure ? (
            <>
              <time dateTime={flight.departureTime}>
                {t('Common:formats.time', { value: departure })}
              </time>
              <small>{t('Common:formats.date', { value: departure })}</small>
            </>
          ) : (
            '—'
          ),
        )}
      </div>
      <div className={`${styles.cell} ${styles.gateTerminal}`}>
        {renderCell(t('FlightList.gate'), flight.gate ?? '—')}
        {renderCell(t('FlightList.terminal'), flight.terminal)}
      </div>
      <div className={styles.cell}>
        {renderCell(
          t('FlightList.status.label'),
          <Badge
            text={t(`FlightList.status.options.${flight.status}`)}
            color={FLIGHT_STATUS_COLORS[flight.status]}
          />,
        )}
      </div>
      <div className={styles.cell}>
        {renderCell(
          t('FlightDetails.duration'),
          t('FlightDetails.durationValue', {
            hours: Math.floor(flight.durationMinutes / 60),
            minutes: flight.durationMinutes % 60,
          }),
        )}
      </div>
      <div className={styles.cell}>{renderCell(t('FlightDetails.aircraft'), flight.aircraft)}</div>
      <div className={styles.cell}>
        {renderCell(t('FlightDetails.registration'), flight.registration)}
      </div>
    </div>
  );
};
