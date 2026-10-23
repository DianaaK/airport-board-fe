import type { FlightGroupOption } from './flight-filters';

export const DATA_TABLE_HEADER_COLORS = ['yellow', 'blue', 'green', 'purple', 'pink'] as const;

export const getGroupingName = (grouping: FlightGroupOption, value: string) => {
  switch (grouping) {
    case 'terminal':
      return `Terminal ${value}`;
    case 'gate':
      return `Gate ${value}`;
    default:
      return value;
  }
};
