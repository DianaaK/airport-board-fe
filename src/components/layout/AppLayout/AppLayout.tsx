import { Outlet } from 'react-router';

import styles from './AppLayout.module.css';
import { ArrivalsIcon } from '../../icons/ArrivalsIcon';
import { DeparturesIcon } from '../../icons/DeparturesIcon';
import { LogoIcon } from '../../icons/LogoIcon';
import { Button } from '../../ui/Button/Button';
import { DateTimeDisplay } from '../DateTimeDisplay/DateTimeDisplay';

export const AppLayout = () => {
  return (
    <div>
      <header className={styles.appHeader}>
        <div className={styles.appBrand}>
          <LogoIcon className={styles.appLogo} />
          <div>
            <strong>SKYPORT</strong>
            <span>INTERNATIONAL AIRPORT</span>
          </div>
        </div>
        <nav className={styles.boardNavigation}>
          <Button size="large" className={styles.departuresButton} icon={<DeparturesIcon />}>
            Departures
          </Button>
          <Button size="large" className={styles.arrivalsButton} icon={<ArrivalsIcon />} disabled>
            Arrivals
          </Button>
        </nav>
        <div className={styles.headerLocation}>
          BUCHAREST<span>Airport local time</span>
        </div>
        <DateTimeDisplay />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
