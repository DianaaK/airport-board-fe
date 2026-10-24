import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export const NotFound = () => {
  const { t } = useTranslation('Common');

  return (
    <>
      <h1>{t('messages.notFound')}</h1>
      <Link to="/">{t('actions.returnDepartures')}</Link>
    </>
  );
};
