import styles from './FlightFilters.module.css';
import { SearchField } from '../../../../components/ui/SearchField/SearchField';
import { Select } from '../../../../components/ui/Select/Select';
import { FLIGHT_STATUSES } from '../../types/flight';
import type { FlightGroupOption, FlightStatusFilter } from '../../utils/flight-filters';

const statusOptions = [
  { value: 'all', label: 'All statuses' },
  ...FLIGHT_STATUSES.map((status) => ({ value: status, label: status })),
];

const groupingOptions = [
  { value: 'terminal', label: 'Group by terminal' },
  { value: 'gate', label: 'Group by gate' },
  { value: 'airline', label: 'Group by airline' },
];

type FlightFiltersProps = {
  search: string;
  status: FlightStatusFilter;
  grouping: FlightGroupOption;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: FlightStatusFilter) => void;
  onGroupingChange: (value: FlightGroupOption) => void;
};

export const FlightFilters = ({
  search,
  status,
  grouping,
  onSearchChange,
  onStatusChange,
  onGroupingChange,
}: FlightFiltersProps) => (
  <div className={styles.filters}>
    <div className={styles.search}>
      <SearchField
        name="search"
        placeholder="Search flights, destinations, airlines..."
        value={search}
        onChange={onSearchChange}
      />
    </div>
    <div className={styles.selectBox}>
      <Select
        name="status"
        value={status}
        options={statusOptions}
        onChange={(status) => onStatusChange(status as FlightStatusFilter)}
      />
    </div>
    <div className={styles.selectBox}>
      <Select
        name="grouping"
        value={grouping}
        options={groupingOptions}
        onChange={(grouping) => onGroupingChange(grouping as FlightGroupOption)}
      />
    </div>
  </div>
);
