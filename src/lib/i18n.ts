import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '@/assets/locales/en/Common.json';
import enFlightlist from '@/assets/locales/en/FlightList.json';
import roCommon from '@/assets/locales/ro/Common.json';
import roFlightlist from '@/assets/locales/ro/FlightList.json';

const storageKey = 'language';

const getSavedLanguage = () => {
  try {
    return localStorage.getItem(storageKey) === 'ro' ? 'ro' : 'en';
  } catch {
    return 'en';
  }
};

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language;
  try {
    localStorage.setItem(storageKey, language);
  } catch {
    console.warn('Unable to save language preference to localStorage');
  }
});

i18n.use(initReactI18next).init({
  resources: {
    en: { Common: enCommon, FlightList: enFlightlist },
    ro: { Common: roCommon, FlightList: roFlightlist },
  },
  defaultNS: 'Common',
  ns: ['Common', 'FlightList'],
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'ro'],
  initAsync: false,
  interpolation: { escapeValue: false },
});

i18n.services.formatter?.add('time', (value: Date, language, options) =>
  new Intl.DateTimeFormat(language, {
    timeZone: 'Europe/Bucharest',
    ...((options.format as Intl.DateTimeFormatOptions | undefined) ?? {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }).format(value),
);

i18n.services.formatter?.add('timeSeconds', (value: Date, language, options) =>
  new Intl.DateTimeFormat(language, {
    timeZone: 'Europe/Bucharest',
    ...((options.format as Intl.DateTimeFormatOptions | undefined) ?? {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  }).format(value),
);

i18n.services.formatter?.add('date', (value: Date, language, options) =>
  new Intl.DateTimeFormat(language, {
    timeZone: 'Europe/Bucharest',
    ...((options.format as Intl.DateTimeFormatOptions | undefined) ?? {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }).format(value),
);

export default i18n;
