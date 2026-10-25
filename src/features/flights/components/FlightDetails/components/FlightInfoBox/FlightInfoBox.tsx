import type { ReactNode } from 'react';

import { useTranslation } from 'react-i18next';

import { Badge } from '@components/ui/Badge/Badge';
import { FLIGHT_STATUS_COLORS } from '@features/flights/constants/flight.constants';
import type { FlightDetails } from '@features/flights/types/flight-details.types';

import styles from './FlightInfoBox.module.css';

const renderCell = (label: string, value?: string | ReactNode | null) => (
  <div className={styles.section}>
    <span className={styles.label}>{label}</span>
    <div className={styles.value}>{value || '-'}</div>
  </div>
);

export const FlightInfoBox = ({ flight }: { flight: FlightDetails }) => {
  const { t } = useTranslation(['FlightList', 'Common']);

  return (
    <div className={styles.grid}>
      <div className={styles.cell}>
        {renderCell(
          t('FlightList.departure'),
          flight.departureTime ? (
            <>
              <time dateTime={flight.departureTime.toISOString()}>
                {t('Common:formats.time', { value: flight.departureTime })}
              </time>
              <small>{t('Common:formats.date', { value: flight.departureTime })}</small>
            </>
          ) : (
            '—'
          ),
        )}
      </div>
      <div className={`${styles.cell} ${styles.gateTerminal}`}>
        {renderCell(t('FlightList.gate'), flight.gate)}
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
          flight.durationMinutes
            ? t('FlightDetails.durationValue', {
                hours: Math.floor(flight.durationMinutes / 60),
                minutes: flight.durationMinutes % 60,
              })
            : null,
        )}
      </div>
      <div className={styles.cell}>{renderCell(t('FlightDetails.aircraft'), flight.aircraft)}</div>
      <div className={styles.cell}>
        {renderCell(t('FlightDetails.registration'), flight.registration)}
      </div>
    </div>
  );
};
