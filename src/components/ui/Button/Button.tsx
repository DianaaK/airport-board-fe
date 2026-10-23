import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Button.module.css';

type ButtonProps = {
  size?: 'small' | 'medium' | 'large';
  icon?: ReactNode;
  iconClassName?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  size = 'medium',
  icon,
  iconClassName,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      {...props}
      className={[styles.button, styles[size], className].filter(Boolean).join(' ')}
    >
      <>
        {icon && (
          <span
            className={[styles.icon, iconClassName].filter(Boolean).join(' ')}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        {children}
      </>
    </button>
  );
};
