import axios from 'axios';

const source = axios.CancelToken.source();

export const axiosCitiesClient = axios.create({
  baseURL: process.env.REACT_APP_CITIES_BASE_URL,
  cancelToken: source.token,
  headers: {
    'x-rapidapi-host': process.env.REACT_APP_RAPID_API_HOST,
    'x-rapidapi-key': process.env.REACT_APP_RAPID_API_Key,
  },
});

export const axiosWeatherClient = axios.create({
  baseURL: process.env.REACT_APP_WEATHER_BASE_URL,
  cancelToken: source.token,
  params: {
    access_key: process.env.REACT_APP_WEATHER_API_KEY,
    units: 'f',
  },
});
