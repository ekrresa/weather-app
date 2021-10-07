import localforage from 'localforage';
import { City, Note } from '../types';

export function extractCoordinates(locations: City[]) {
  return locations.map(({ id, latitude, longitude }) => {
    return { cityId: id, coords: latitude + ',' + longitude };
  });
}

export function generateId() {
  return crypto.getRandomValues(new Uint16Array(1))[0].toString();
}

export async function getNotes(cityId: string) {
  const notes = (await localforage.getItem<Note[]>(cityId)) ?? [];
  return notes;
}

export async function saveNotes(cityId: string, note: Note) {
  const notes = (await localforage.getItem<string[]>(cityId)) ?? [];
  const savedNotes = [note, ...notes];

  await localforage.setItem(cityId, savedNotes);
}

export async function editNotes(cityId: string, notes: Note[]) {
  await localforage.setItem(cityId, notes);
}
