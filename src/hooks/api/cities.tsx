import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { CitiesResponse, City, CityResponse } from '../../types';
import { axiosCitiesClient } from '../../utils/axios';

const ONE_HOUR_IN_MILLISECONDS = 3_600_000;

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
      enabled: cityId.length > 0,
      select: response => response.data,
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }
  );
}

export function useCitySearch(cityName: string = '') {
  return useQuery<AxiosResponse<CitiesResponse>, Error, City[]>(
    ['city', 'search', cityName],
    () =>
      axiosCitiesClient.get(`/v1/geo/cities`, {
        params: { limit: 30, namePrefix: cityName },
      }),
    {
      enabled: cityName.length > 0,
      select: response => response.data.data,
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }
  );
}
