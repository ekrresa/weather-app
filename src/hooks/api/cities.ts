import { AxiosError, AxiosResponse } from 'axios';
import { useQuery } from 'react-query';

import { getFavouriteCities } from '../../helpers/cities';
import { CitiesAPIError, CitiesResponse, City, CityResponse } from '../../types';
import { axiosCitiesClient } from '../../utils/axios';

const ONE_HOUR_IN_MILLISECONDS = 3_600_000;

export const citiesKeyFactory = {
  allCities: () => ['cities'] as const,
  cityDetails: (cityId: string) => ['cities', 'details', cityId],
  cityByCoordinates: (lat: string, long: string) => ['cities', 'details', lat, long],
  citySearch: (cityName: string) => ['cities', 'search', cityName],
  favouriteCities: () => ['cities', 'favourite'],
};

export function useGetCities() {
  return useQuery<
    AxiosResponse<CitiesResponse>,
    AxiosError<CitiesAPIError>,
    CitiesResponse
  >(
    citiesKeyFactory.allCities(),
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
    citiesKeyFactory.cityByCoordinates(lat, long),
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
    citiesKeyFactory.cityDetails(cityId),
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
    citiesKeyFactory.citySearch(cityName),
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
    citiesKeyFactory.favouriteCities(),
    () => getFavouriteCities(),
    {
      staleTime: Infinity,
    }
  );
}
