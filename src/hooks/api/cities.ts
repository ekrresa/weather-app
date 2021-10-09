import { AxiosError, AxiosResponse } from 'axios';
import { useQuery } from 'react-query';

import { getFavouriteCities } from '../../helpers/cities';
import { CitiesAPIError, CitiesResponse, City, CityResponse } from '../../types';
import { axiosCitiesClient } from '../../utils/axios';

const ONE_HOUR_IN_MILLISECONDS = 3_600_000;

export function useGetCities() {
  return useQuery<
    AxiosResponse<CitiesResponse>,
    AxiosError<CitiesAPIError>,
    CitiesResponse
  >(
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

export function useCityByCoordinates(lat: string, long: string) {
  return useQuery<AxiosResponse<CitiesResponse>, AxiosError<CitiesAPIError>, City>(
    ['city', 'coordinates', { lat, long }],
    () => axiosCitiesClient.get('/v1/geo/cities', { params: { location: lat + long } }),
    {
      enabled: Boolean(lat && long),
      select: response => response.data.data[0],
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }
  );
}

export function useCityDetails(cityId: string = '') {
  return useQuery<AxiosResponse<CityResponse>, AxiosError<CitiesAPIError>, City>(
    ['city', cityId],
    () => axiosCitiesClient.get(`/v1/geo/cities/${cityId}`),
    {
      enabled: cityId.length > 0,
      select: response => response.data.data,
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }
  );
}

export function useCitySearch(cityName: string = '') {
  return useQuery<AxiosResponse<CitiesResponse>, AxiosError<CitiesAPIError>, City[]>(
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

export function useFavouriteCitiesQuery() {
  return useQuery<City[], AxiosError<CitiesAPIError>>(
    ['cities', 'favourite'],
    () => getFavouriteCities(),
    {
      staleTime: Infinity,
    }
  );
}
