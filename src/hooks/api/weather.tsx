import { AxiosResponse } from 'axios';
import { useQueries, UseQueryResult } from 'react-query';
import { WeatherResponse } from '../../types';
import { axiosWeatherClient } from '../../utils/axios';

const ONE_HOUR_IN_MILLISECONDS = 3_600_000;

export function useGetCityWeather(locations: any[]) {
  return useQueries(
    locations.map(location => ({
      queryKey: ['weather', location.location],
      queryFn: (): Promise<AxiosResponse<WeatherResponse>> =>
        axiosWeatherClient.get('/current', {
          params: {
            query: location.location,
          },
        }),
      enabled: location.location.length > 0,
      select: response => ({
        ...(response as AxiosResponse<WeatherResponse>).data,
        request: {
          ...(response as AxiosResponse<WeatherResponse>).data.request,
          cityId: location.cityId,
        },
      }),
      staleTime: ONE_HOUR_IN_MILLISECONDS,
    }))
  ) as UseQueryResult<WeatherResponse, Error>[];
}
