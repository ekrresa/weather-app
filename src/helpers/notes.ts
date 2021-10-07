import localforage from 'localforage';
import { Note } from '../types';

export function generateId() {
  return crypto.getRandomValues(new Uint16Array(1))[0].toString();
}

export async function getNotes(cityId: string) {
  const notes = (await localforage.getItem<Note[]>(cityId)) ?? [];
  return notes;
}

export async function saveNote(cityId: string, note: Note) {
  const notes = (await localforage.getItem<Note[]>(cityId)) ?? [];
  const savedNotes = [note, ...notes];

  await localforage.setItem(cityId, savedNotes);
}

export async function deleteNote(cityId: string, noteId: string) {
  const notes = await localforage.getItem<Note[]>(cityId);

  if (notes) {
    const remainingNotes = notes.filter(note => note.id !== noteId);
    await localforage.setItem(cityId, remainingNotes);
  }
}

export async function editNotes(cityId: string, notes: Note[]) {
  await localforage.setItem(cityId, notes);
}
