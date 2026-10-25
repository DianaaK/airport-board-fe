import { DeparturesIcon } from '@components/icons/DeparturesIcon';
import type { Airport } from '@features/flights/types/flight-details.types';

import styles from './FlightRouteSummary.module.css';
import { AirportSummary } from '../AirportSummary/AirportSummary';

type FlightRouteSummaryProps = {
  origin: Airport | null;
  destination: Airport | null;
};

export const FlightRouteSummary = ({ origin, destination }: FlightRouteSummaryProps) => (
  <div className={styles.airports}>
    <AirportSummary airport={origin} />
    <div className={styles.routeLine} aria-hidden="true">
      <DeparturesIcon />
    </div>
    <AirportSummary airport={destination} destination />
  </div>
);
