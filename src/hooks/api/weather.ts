import { AxiosResponse } from 'axios';
import { useQueries, useQuery, UseQueryResult } from 'react-query';
import { WeatherKey, WeatherResponse } from '../../types';
import { axiosWeatherClient } from '../../utils/axios';

const ONE_HOUR_IN_MILLISECONDS = 3_600_000;

export function useCitiesWeather(locations: WeatherKey[]) {
  return useQueries(
    locations.map(location => ({
      queryKey: ['weather', { coords: location.coords }],
      queryFn: (): Promise<AxiosResponse<WeatherResponse>> =>
        axiosWeatherClient.get('/current', {
          params: {
            query: location.coords,
          },
        }),
      enabled: Boolean(location.coords),
      select: response => ({
        ...(response as AxiosResponse<WeatherResponse>).data,
      }),
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }))
  ) as UseQueryResult<WeatherResponse, Error>[];
}

export function useCityWeather(location: WeatherKey) {
  return useQuery<AxiosResponse<WeatherResponse>, Error, WeatherResponse>(
    ['weather', { coords: location.coords }],
    () =>
      axiosWeatherClient.get('/current', {
        params: {
          query: location.coords,
        },
      }),
    {
      enabled: Boolean(location.coords),
      select: response => response.data,
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }
  );
}
