import localforage from 'localforage';
import { City } from '../types';

export function extractCoordinates(locations: City[]) {
  return locations.map(({ id, latitude, longitude }) => {
    return { cityId: id, coords: latitude + ',' + longitude };
  });
}

export async function getNotes(cityId: string) {
  const notes = (await localforage.getItem<string[]>(cityId)) ?? [];
  return notes;
}

export async function saveNotes(cityId: string, note: string) {
  const notes = (await localforage.getItem<string[]>(cityId)) ?? [];
  const savedNotes = [note, ...notes];

  await localforage.setItem(cityId, savedNotes);
}
