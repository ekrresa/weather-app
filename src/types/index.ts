export type CityResponse = {
  data: City[];
  links: Link[];
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
