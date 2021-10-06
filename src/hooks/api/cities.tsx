import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { CitiesResponse, City, CityResponse } from '../../types';
import { axiosCitiesClient } from '../../utils/axios';

const ONE_HOUR_IN_MILLISECONDS = 3_600_000;
const ONE_DAY_IN_MILLISECONDS = 86_400_000;

export function useGetCities() {
  return useQuery<AxiosResponse<CitiesResponse>, Error, CitiesResponse>(
    ['cities'],
    () =>
      axiosCitiesClient.get('/v1/geo/cities', {
        params: {
          includeDeleted: 'NONE',
          distanceUnit: 'MI',
          limit: 15,
          sort: '-population',
        },
      }),
    {
      select: response => response.data,
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }
  );
}

export function useCityDetails(cityId: string = '') {
  return useQuery<AxiosResponse<CityResponse>, Error, CityResponse>(
    ['city', cityId],
    () => axiosCitiesClient.get(`/v1/geo/cities/${cityId}`),
    {
      cacheTime: ONE_DAY_IN_MILLISECONDS,
      enabled: Boolean(cityId?.length > 0),
      select: response => response.data,
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }
  );
}
