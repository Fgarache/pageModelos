import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_FIREBASE } from '../data';
import { applyMetadata, getModelMetadata, getPageMetadata, getTourLocationMetadata } from '../data/metadata';
import { TOUR_LOCATION_MAP } from '../pages/toursLocations/locationData';

const isModelPath = (path: string) => {
  const normalized = path.split('?')[0].split('#')[0];
  const staticRoutes = new Set(['/', '/modelos', '/tours', '/rifas', '/vip']);

  if (staticRoutes.has(normalized)) return false;

  const segments = normalized.split('/').filter(Boolean);
  return segments.length === 1;
};

export default function MetadataManager() {
  const location = useLocation();

  useEffect(() => {
    let active = true;

    const updateMetadata = async () => {
      const path = location.pathname;

      if (path.startsWith('/tours/')) {
        const locationSlug = path.replace('/tours/', '').split('/')[0];
        const locationInfo = TOUR_LOCATION_MAP[locationSlug];

        if (locationInfo) {
          applyMetadata(getTourLocationMetadata(path, locationInfo.title.replace('Tours en ', '')));
        } else {
          applyMetadata(getPageMetadata('/tours'));
        }
        return;
      }

      if (!isModelPath(path)) {
        applyMetadata(getPageMetadata(path));
        return;
      }

      const alias = path.replace(/^\//, '');
      if (!alias) {
        applyMetadata(getPageMetadata('/'));
        return;
      }

      try {
        const model = await API_FIREBASE.getUserInfo(alias);

        if (!active) return;

        if (model) {
          applyMetadata(getModelMetadata(path, model));
        } else {
          applyMetadata(getPageMetadata('/'));
        }
      } catch {
        if (active) {
          applyMetadata(getPageMetadata('/'));
        }
      }
    };

    updateMetadata();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  return null;
}
