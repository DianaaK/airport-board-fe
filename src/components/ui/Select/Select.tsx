import { type ChangeEvent, type SelectHTMLAttributes } from 'react';

import styles from './Select.module.css';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> & {
  value: string;
  options: SelectOption[];
  onChange: (value: string, event: ChangeEvent<HTMLSelectElement>) => void;
};

export const Select = ({ value, options, onChange, className, ...selectProps }: SelectProps) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const option = options.find((option) => option.value === event.currentTarget.value);
    if (option) {
      onChange(option.value, event);
    }
  };

  return (
    <select
      className={[styles.select, className].filter(Boolean).join(' ')}
      {...selectProps}
      value={value}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
