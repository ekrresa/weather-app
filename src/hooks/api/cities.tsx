import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { CityResponse } from '../../types';
import { axiosCitiesClient } from '../../utils/axios';

const ONE_HOUR_IN_MILLISECONDS = 3_600_000;

export function useGetCities() {
  return useQuery<AxiosResponse<CityResponse>, Error, CityResponse>(
    ['cities'],
    () =>
      axiosCitiesClient.get('/v1/geo/cities', {
        params: {
          includeDeleted: 'NONE',
          distanceUnit: 'MI',
          limit: 50,
          sort: '-population',
        },
      }),
    {
      select: response => response.data,
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }
  );
}
