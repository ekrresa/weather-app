import localforage from 'localforage';
import { City } from '../types';

const FAVOURITE_CITIES_KEY = 'favCities';
const DELETED_CITIES_KEY = 'deletedCities';

export async function getFavouriteCities() {
  return (await localforage.getItem<City[]>(FAVOURITE_CITIES_KEY)) ?? [];
}

export async function removeFavouriteCity(favCityId: number) {
  const favCitiesFromStorage = await localforage.getItem<City[]>(FAVOURITE_CITIES_KEY);

  if (favCitiesFromStorage) {
    const filteredCities = favCitiesFromStorage.filter(city => city.id !== favCityId);
    await localforage.setItem(FAVOURITE_CITIES_KEY, filteredCities);
  }
}

export async function saveFavouriteCity(favCity: City) {
  const favCitiesFromStorage =
    (await localforage.getItem<City[]>(FAVOURITE_CITIES_KEY)) ?? [];

  const updatedFavCities = [...favCitiesFromStorage, favCity].sort((a, b) =>
    a.city < b.city ? -1 : 1
  );

  await localforage.setItem(FAVOURITE_CITIES_KEY, updatedFavCities);
}

export async function saveDeletedCities(deletedCity: City) {
  const removedCitiesFromStorage =
    (await localforage.getItem<City[]>(DELETED_CITIES_KEY)) ?? [];

  const updatedRemovedCities = [...removedCitiesFromStorage, deletedCity];
  await localforage.setItem(DELETED_CITIES_KEY, updatedRemovedCities);
}

export async function getDeletedCities() {
  return localforage.getItem<City[]>(DELETED_CITIES_KEY);
}
