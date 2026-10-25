import type { BadgeColor } from '../../../components/ui/Badge/Badge';
import type { FlightStatus } from '../types/flight';

export const FLIGHT_STATUS_COLORS: Record<FlightStatus, BadgeColor> = {
  'On Time': 'green',
  Delayed: 'yellow',
  Cancelled: 'red',
};
