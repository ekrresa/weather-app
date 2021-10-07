import { SyntheticEvent, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import arrayDiff from 'lodash.differencewith';
import styled from 'styled-components';

import {
  useCitySearch,
  useFavouriteCitiesQuery,
  useGetCities,
} from '../hooks/api/cities';
import { useGetCityWeather } from '../hooks/api/weather';
import { CityBlock } from '../components/City';
import { ComboBox } from '../components/ComboBox';
import { Header } from '../components/Header';
import { extractCoordinates } from '../helpers';
import { City } from '../types';
import { removeFavouriteCity, saveFavouriteCity } from '../helpers/cities';

export default function Home() {
  const history = useHistory();
  const [locations, setLocations] = useState<any[]>([]);
  const [sortedCities, setSortedCities] = useState<City[]>([]);
  const [cityName, setCityName] = useState('');

  const queryClient = useQueryClient();
  const cities = useGetCities();
  const weather = useGetCityWeather(locations);
  const favouriteCities = useFavouriteCitiesQuery();
  const citySearch = useCitySearch(cityName);

  useEffect(() => {
    if (cities.data && favouriteCities.data) {
      const str = extractCoordinates(cities.data.data);
      const sortedCities = cities.data.data.sort((a, b) => (a.city < b.city ? -1 : 1));
      const notFavouriteCities = arrayDiff(
        sortedCities,
        favouriteCities.data,
        (a, b) => a.id === b.id
      );

      setLocations(str);
      setSortedCities(notFavouriteCities);
    }
  }, [cities.data, favouriteCities.data]);

  useEffect(() => {
    if (favouriteCities) {
    }
  }, [favouriteCities]);

  const handleSelect = (city: City | null | undefined) => {
    if (city) {
      history.push(`/city?cityId=${city.id}&lat=${city.latitude}&long=${city.longitude}`);
    }
  };

  const removeCity = (e: SyntheticEvent, cityId: number) => {
    e.preventDefault();

    setSortedCities(sortedCities.filter(city => city.id !== cityId));
  };

  const removeFavourite = async (e: SyntheticEvent, cityId: number) => {
    e.preventDefault();

    const removedCity = cities.data?.data.find(city => city.id === cityId);

    if (removedCity) {
      setSortedCities(
        [...sortedCities, removedCity].sort((a, b) => (a.city < b.city ? -1 : 1))
      );
      await removeFavouriteCity(cityId);
      await queryClient.invalidateQueries(['cities', 'favourite']);
    }
  };

  const setFavourite = async (e: SyntheticEvent, cityId: number) => {
    e.preventDefault();

    const [favCity] = sortedCities.filter(city => city.id === cityId);
    const remainCities = sortedCities.filter(city => city.id !== cityId);

    setSortedCities(remainCities);
    await saveFavouriteCity(favCity);
    await queryClient.invalidateQueries(['cities', 'favourite']);
  };

  if (cities.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledHome>
      <Header />

      <div className="today">
        <div className="time">{format(new Date(), 'h:mm b')}</div>
        <div className="day">{format(new Date(), 'EEEE, MMMM do')}</div>
      </div>

      <section className="container">
        <div className="location__title">
          <h2>Locations</h2>

          <ComboBox
            data={citySearch.data}
            isError={citySearch.isError}
            loading={citySearch.isLoading}
            onChange={val => setCityName(val)}
            selectCity={handleSelect}
          />
        </div>

        <div className="locations">
          {favouriteCities.isSuccess &&
            favouriteCities.data.map((city, index) => (
              <CityBlock
                key={city.id}
                city={city}
                isFavourite={true}
                removeCity={removeCity}
                removeFavourite={removeFavourite}
                setFavourite={setFavourite}
                weather={weather[index]}
              />
            ))}

          {cities.isSuccess &&
            sortedCities.length > 0 &&
            sortedCities.map((city, index) => (
              <CityBlock
                key={city.id}
                city={city}
                isFavourite={false}
                removeCity={removeCity}
                setFavourite={setFavourite}
                weather={weather[index]}
              />
            ))}
        </div>
      </section>
    </StyledHome>
  );
}

const StyledHome = styled.section`
  .header {
    background: #1e213a;

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
    }

    .logo {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .temperature {
      margin-left: auto;
      display: flex;

      .celcius,
      .fahrenheit {
        border-radius: 50%;
        cursor: pointer;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
      }

      .celcius {
        background: #e7e7eb;
        color: #110e3c;
      }
      .fahrenheit {
        background: #585676;
        color: #e7e7eb;
        margin-left: 1rem;
      }
    }
  }

  .today {
    font-family: 'Roboto';
    font-size: 1.9rem;
    text-align: center;
    font-weight: 500;
    padding: 1.5rem;
    margin-top: 3.2rem;

    .day {
      font-size: 1.15rem;
      text-transform: uppercase;
      margin-top: 0.4rem;
    }
  }

  .location__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4rem;
    margin-bottom: 2rem;

    h2 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 500;
      font-family: 'Roboto';
    }
  }

  .locations {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(min(11rem, 100%), 1fr));
    padding-bottom: 4rem;
  }
`;
