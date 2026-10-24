import type { ChangeEvent, InputHTMLAttributes } from 'react';

import styles from './SearchField.module.css';
import { SearchIcon } from '../../icons/SearchIcon';

type SearchFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> & {
  placeholder: string;
  value: string;
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
};

export const SearchField = ({
  placeholder,
  value,
  onChange,
  className,
  ...inputProps
}: SearchFieldProps) => (
  <span className={[styles.search, className].filter(Boolean).join(' ')}>
    <SearchIcon className={styles.searchIcon} />
    <input
      {...inputProps}
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.currentTarget.value, event)}
    />
  </span>
);
