import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';

import styles from './AppLayout.module.css';
import { ArrivalsIcon } from '../../icons/ArrivalsIcon';
import { DeparturesIcon } from '../../icons/DeparturesIcon';
import { LogoIcon } from '../../icons/LogoIcon';
import { Button } from '../../ui/Button/Button';
import { Select } from '../../ui/Select/Select';
import { DateTimeDisplay } from '../DateTimeDisplay/DateTimeDisplay';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ro', label: 'Română' },
];

export const AppLayout = () => {
  const {
    t,
    i18n: { resolvedLanguage, changeLanguage },
  } = useTranslation('Common', { keyPrefix: 'labels' });

  return (
    <div>
      <header className={styles.appHeader}>
        <div className={styles.appBrand}>
          <LogoIcon className={styles.appLogo} />
          <div>
            <strong>{t('city')}</strong>
            <span>{t('airport')}</span>
          </div>
        </div>
        <nav className={styles.boardNavigation}>
          <Button size="large" className={styles.departuresButton} icon={<DeparturesIcon />}>
            {t('departures')}
          </Button>
          <Button size="large" className={styles.arrivalsButton} icon={<ArrivalsIcon />} disabled>
            {t('arrivals')}
          </Button>
        </nav>
        <div className={styles.headerLocation}>
          {t('city')}
          <span>{t('localTime')}</span>
        </div>
        <DateTimeDisplay />
        <div className={styles.languageSelect}>
          <Select
            name="language"
            value={resolvedLanguage ?? 'en'}
            options={LANGUAGE_OPTIONS}
            onChange={(value) => changeLanguage(value)}
          />
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
