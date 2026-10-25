import { useCallback, useState } from 'react';

import { PageLayout } from '@components/layout/PageLayout/PageLayout';
import { FlightDetails } from '@features/flights/components/FlightDetails/FlightDetails';
import { FlightList } from '@features/flights/components/FlightList/FlightList';

export const FlightsPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeDetails = useCallback(() => setSelectedId(null), []);

  return (
    <PageLayout
      details={
        selectedId ? (
          <FlightDetails key={selectedId} id={selectedId} onClose={closeDetails} />
        ) : undefined
      }
    >
      <FlightList onSelectFlight={setSelectedId} />
    </PageLayout>
  );
};
