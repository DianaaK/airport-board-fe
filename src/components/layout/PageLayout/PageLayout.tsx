import type { ReactNode } from 'react';

import styles from './PageLayout.module.css';

type PageLayoutProps = {
  children: ReactNode;
  details?: ReactNode;
};

export const PageLayout = ({ children, details }: PageLayoutProps) => {
  return (
    <div className={`${styles.boardWorkspace} ${details ? styles.hasDetails : ''}`}>
      <div className={styles.boardPrimary}>{children}</div>
      {details && (
        <aside className={styles.boardDetails} data-testid="details-panel">
          {details}
        </aside>
      )}
    </div>
  );
};
