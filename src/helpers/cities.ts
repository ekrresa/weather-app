import localforage from 'localforage';
import { City } from '../types';

const FAVOURITE_CITY_KEY = 'favCities';

export async function getFavouriteCities() {
  return (await localforage.getItem<City[]>(FAVOURITE_CITY_KEY)) ?? [];
}

export async function removeFavouriteCity(favCityId: number) {
  const favCitiesFromStorage = await localforage.getItem<City[]>(FAVOURITE_CITY_KEY);

  if (favCitiesFromStorage) {
    const filteredCities = favCitiesFromStorage.filter(city => city.id !== favCityId);
    await localforage.setItem(FAVOURITE_CITY_KEY, filteredCities);
  }
}

export async function saveFavouriteCity(favCity: City) {
  const favCitiesFromStorage =
    (await localforage.getItem<City[]>(FAVOURITE_CITY_KEY)) ?? [];

  const updatedFavCities = [...favCitiesFromStorage, favCity].sort((a, b) =>
    a.city < b.city ? -1 : 1
  );

  await localforage.setItem(FAVOURITE_CITY_KEY, updatedFavCities);
}
