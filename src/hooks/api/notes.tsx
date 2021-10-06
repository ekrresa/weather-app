import { useQuery } from 'react-query';
import { getNotes } from '../../helpers';

export function useNotesQuery(cityId: string = '') {
  return useQuery(['note', cityId], () => getNotes(cityId), {
    enabled: cityId.length > 0,
    staleTime: Infinity,
  });
}
