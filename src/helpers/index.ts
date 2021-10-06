import { City } from '../types';

export function extractCoordinates(locations: City[]) {
  return locations.map(({ id, latitude, longitude }) => {
    return { cityId: id, coords: latitude + ',' + longitude };
  });
}
