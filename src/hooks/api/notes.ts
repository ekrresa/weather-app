import { useQuery } from 'react-query';
import { getNotes } from '../../helpers/notes';

export const notesKeyFactory = {
  notesOfACity: (cityId: string) => ['notes', 'city', cityId],
};

export function useNotesQuery(cityId: string = '') {
  return useQuery(notesKeyFactory.notesOfACity(cityId), () => getNotes(cityId), {
    enabled: cityId.length > 0,
    staleTime: Infinity,
  });
}
