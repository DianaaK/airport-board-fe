import { useTranslation } from 'react-i18next';

import styles from './FlightFilters.module.css';
import { SearchField } from '../../../../components/ui/SearchField/SearchField';
import { Select } from '../../../../components/ui/Select/Select';
import { FLIGHT_STATUSES } from '../../types/flight';
import type { FlightGroupOption, FlightStatusFilter } from '../../utils/flight-filters';

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
}: FlightFiltersProps) => {
  const { t } = useTranslation('FlightList');

  const statusOptions = [
    { value: 'all', label: t('FlightFilters.allStatuses') },
    ...FLIGHT_STATUSES.map((status) => ({
      value: status,
      label: t(`FlightList.status.options.${status}`),
    })),
  ];
  const groupingOptions = [
    { value: 'terminal', label: t('FlightFilters.groupTerminal') },
    { value: 'gate', label: t('FlightFilters.groupGate') },
    { value: 'airline', label: t('FlightFilters.groupAirline') },
  ];

  return (
    <div className={styles.filters}>
      <div className={styles.search}>
        <SearchField
          name="search"
          placeholder={t('FlightFilters.search')}
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
          data-testid="grouping-select"
          value={grouping}
          options={groupingOptions}
          onChange={(grouping) => onGroupingChange(grouping as FlightGroupOption)}
        />
      </div>
    </div>
  );
};
