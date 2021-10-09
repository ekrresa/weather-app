export type CitiesResponse = {
  data: City[];
  links: Link[];
};

export type CityResponse = {
  data: City;
};

export type CitiesAPIError = {
  errors: Array<{ code: string; message: string }>;
};

export type WeatherAPIError = {
  success: boolean;
  error: {
    code: number;
    type: string;
    info: string;
  };
};

export type City = {
  id: number;
  wikiDataId: string;
  type: string;
  city: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  latitude: number;
  longitude: number;
  population: number;
};

type Link = {
  rel: string;
  href: string;
};

export type Note = {
  id: string;
  content: string;
};

export type WeatherKey = {
  cityId?: number | string;
  coords: string;
};

export type WeatherResponse = {
  request: {
    type: string;
    query: string;
    language: string;
    unit: string;
  };
  location: {
    name: string;
    country: string;
    region: string;
    lat: string;
    lon: string;
    timezone_id: string;
    localtime: string;
    localtime_epoch: number;
    utc_offset: string;
  };
  current: {
    observation_time: string;
    temperature: number;
    weather_code: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    pressure: number;
    precip: number;
    humidity: number;
    cloudcover: number;
    feelslike: number;
    uv_index: number;
    visibility: number;
  };
};
