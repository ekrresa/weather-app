import { useQuery } from 'react-query';
import { getNotes } from '../../helpers/notes';

export function useNotesQuery(cityId: string = '') {
  return useQuery(['notes', cityId], () => getNotes(cityId), {
    enabled: cityId.length > 0,
    staleTime: Infinity,
  });
}
