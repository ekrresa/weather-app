import { SyntheticEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { format } from 'date-fns';
import arrayDiff from 'lodash.differencewith';
import localforage from 'localforage';
import toast from 'react-hot-toast';
import styled, { css } from 'styled-components';

import {
  citiesKeyFactory,
  useCityByCoordinates,
  useCitySearch,
  useFavouriteCitiesQuery,
  useGetCities,
} from '../hooks/api/cities';
import { useCitiesWeather, useCityWeather } from '../hooks/api/weather';
import { CityBlock } from '../components/CityBlock';
import { ComboBox } from '../components/ComboBox';
import { Header } from '../components/Header';
import { extractCoordinates } from '../helpers';
import { City } from '../types';
import { removeFavouriteCity, saveFavouriteCity } from '../helpers/cities';
import { Loader } from '../components/Loader';

export default function Home() {
  const history = useHistory();
  const queryClient = useQueryClient();

  const [locations, setLocations] = useState<any[]>([]);
  const [sortedCities, setSortedCities] = useState<City[]>([]);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [userCoords, setUserCoords] = useState({ lat: '', long: '' });

  const cities = useGetCities();
  const weather = useCitiesWeather(locations);
  const userCityWeatherDetails = useCityWeather({
    coords: userCoords.lat + ',' + userCoords.long,
  });
  const favouriteCities = useFavouriteCitiesQuery();
  const citySearch = useCitySearch(citySearchTerm);
  const userCity = useCityByCoordinates(userCoords.lat, userCoords.long);

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(geoPosition, geoPositionError);
    }
  }, []);

  useEffect(() => {
    (async function () {
      const LOCATION_PERMISSION_GRANTED = await localforage.getItem('PERMISSION_GRANTED');

      if (userCity.data && !LOCATION_PERMISSION_GRANTED) {
        localforage.setItem('PERMISSION_GRANTED', true);

        history.push(
          `/city?cityId=${userCity.data.id}&lat=${userCoords.lat}&long=${userCoords.long}&isCurrentLocation=true&isFavourite=true`
        );
      }
    })();
  }, [history, userCity.data, userCoords.lat, userCoords.long]);

  const geoPosition = (position: GeolocationPosition) => {
    const latitudeSign = position.coords.latitude < 0 ? '' : '+';
    const longitudeSign = position.coords.longitude < 0 ? '' : '+';

    setUserCoords({
      lat: latitudeSign + String(position.coords.latitude),
      long: longitudeSign + String(position.coords.longitude),
    });
  };

  const geoPositionError = (error: GeolocationPositionError) => {
    if (error.code === 1 || error.code === 3) {
      toast.error(
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Please enable your location and refresh the page to view weather details for it.
        </span>
      );
    }

    if (error.code === 0 || error.code === 2) {
      toast.error(
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Unable to access your location. Please check your internet connection.
        </span>
      );
    }
  };

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
      await queryClient.invalidateQueries(citiesKeyFactory.favouriteCities());
    }
  };

  const setFavourite = async (e: SyntheticEvent, cityId: number) => {
    e.preventDefault();

    const [favCity] = sortedCities.filter(city => city.id === cityId);
    const remainCities = sortedCities.filter(city => city.id !== cityId);

    setSortedCities(remainCities);
    await saveFavouriteCity(favCity);
    await queryClient.invalidateQueries(citiesKeyFactory.favouriteCities());
  };

  if (cities.isLoading) {
    return <Loader />;
  }

  return (
    <StyledHome isUserCity={userCity.isSuccess}>
      <Header />

      <div
        className="today"
        onClick={() => {
          if (userCity.data) {
            history.push(
              `/city?cityId=${userCity.data.id}&lat=${userCoords.lat}&long=${userCoords.long}&isCurrentLocation=true&isFavourite=true`
            );
          }
        }}
      >
        {userCity.isSuccess && (
          <h1>
            {userCity.data?.city}, {userCity.data?.country}
          </h1>
        )}
        <div className="time">{format(new Date(), 'h:mm b')}</div>
        <div className="day">{format(new Date(), 'EEEE, MMMM do')}</div>
        {userCityWeatherDetails.isSuccess && (
          <div className="weather__description">
            {userCityWeatherDetails.data?.current?.weather_descriptions[0]}
          </div>
        )}
      </div>

      <section className="container">
        <div className="location__title">
          <h2>Locations</h2>

          <ComboBox
            data={citySearch.data}
            isError={citySearch.isError}
            loading={citySearch.isLoading}
            onChange={val => setCitySearchTerm(val)}
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

const StyledHome = styled.section<{ isUserCity: boolean }>`
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
    padding: 2.5rem 1.5rem;
    margin-top: 3.2rem;
    background: #312d4e;
    border-radius: 19px;
    max-width: 42rem;
    margin-left: auto;
    margin-right: auto;

    ${props =>
      props.isUserCity
        ? css`
            &:hover {
              box-shadow: 20px 20px 60px #2a2642, -20px -20px 60px #38345a;
            }

            cursor: pointer;
          `
        : null}

    h1 {
      font-size: 2.4rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      margin-top: 0rem;
    }
    .time {
      margin-bottom: 0.3rem;
      font-size: 1.5rem;
    }
    .day {
      font-size: 1.15rem;
      margin-top: 0.4rem;
    }
    .weather__description {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      font-weight: 500;
      text-transform: uppercase;
    }
  }

  .location__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4rem;
    margin-bottom: 3rem;

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
