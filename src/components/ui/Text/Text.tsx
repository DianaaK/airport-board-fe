import type { ComponentPropsWithoutRef, ElementType } from 'react';

import styles from './Text.module.css';

type TextProps<Component extends ElementType> = {
  component?: Component;
  variant?: 'body' | 'label' | 'caption';
  tone?: 'default' | 'muted' | 'error';
} & Omit<ComponentPropsWithoutRef<Component>, 'component' | 'color'>;

export const Text = <Component extends ElementType = 'span'>({
  component,
  variant = 'body',
  tone = 'default',
  className,
  ...props
}: TextProps<Component>) => {
  const Tag = component ?? 'span';
  return (
    <Tag
      {...props}
      className={[styles.text, styles[variant], styles[tone], className].filter(Boolean).join(' ')}
    />
  );
};
