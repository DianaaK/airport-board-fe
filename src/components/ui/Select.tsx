import { type ChangeEvent } from 'react';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id?: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string, event: ChangeEvent<HTMLSelectElement>) => void;
};

export function Select({ label, value, options, onChange, id, ...selectProps }: SelectProps) {
  const selectId = id ?? label;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const option = options.find((option) => option.value === event.currentTarget.value);
    if (option) {
      onChange(option.value, event);
    }
  };

  return (
    <label htmlFor={id}>
      {label}
      <select {...selectProps} id={selectId} value={value} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
