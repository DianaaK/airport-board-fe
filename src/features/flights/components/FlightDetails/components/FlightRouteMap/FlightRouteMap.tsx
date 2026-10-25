import { useState } from 'react';

import type { LatLngTuple } from 'leaflet';
import { useTranslation } from 'react-i18next';
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import type { Airport } from '@features/flights/types/flight-details.types';

import styles from './FlightRouteMap.module.css';

type FlightRouteMapProps = {
  origin: Airport | null;
  destination: Airport | null;
};

export const FlightRouteMap = ({ origin, destination }: FlightRouteMapProps) => {
  const { t } = useTranslation('FlightList', { keyPrefix: 'FlightDetails' });
  const [tilesUnavailable, setTilesUnavailable] = useState(false);

  if (!origin?.latitude || !origin.longitude || !destination?.latitude || !destination.longitude) {
    return (
      <div className={`${styles.mapFrame} ${styles.map}`}>
        <span className={styles.mapNotice}>{t('routeUnavailable')}</span>
      </div>
    );
  }

  const departure: LatLngTuple = [origin.latitude, origin.longitude];
  const arrival: LatLngTuple = [destination.latitude, destination.longitude];

  return (
    <div className={styles.mapFrame}>
      {tilesUnavailable && <span className={styles.mapNotice}>{t('mapUnavailable')}</span>}
      <MapContainer
        className={styles.map}
        bounds={[departure, arrival]}
        boundsOptions={{ padding: [40, 40], maxZoom: 7 }}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}
          maxZoom={18}
          eventHandlers={{
            tileerror: () => setTilesUnavailable(true),
            tileload: () => setTilesUnavailable(false),
          }}
        />
        <Polyline
          positions={[departure, arrival]}
          pathOptions={{ color: '#ffca54', weight: 3, dashArray: '7 9' }}
        />
        {[
          { airport: origin, position: departure, key: 'origin' },
          { airport: destination, position: arrival, key: 'destination' },
        ].map(({ airport, position, key }) => (
          <CircleMarker
            key={key}
            center={position}
            radius={6}
            pathOptions={{ color: '#ffca54', fillColor: '#ffca54', fillOpacity: 1 }}
          >
            <Tooltip permanent direction="bottom" className={styles.mapLabel}>
              <strong>{airport.code || '—'}</strong>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};
