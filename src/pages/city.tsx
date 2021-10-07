import { useHistory, useLocation } from 'react-router-dom';
import { HiStar } from 'react-icons/hi';
import { IoIosArrowBack, IoMdStarOutline } from 'react-icons/io';
import { useQueryClient } from 'react-query';
import { format } from 'date-fns';
import qs from 'query-string';
import styled from 'styled-components';

import { Header } from '../components/Header';
import { useCityDetails } from '../hooks/api/cities';
import { useCityWeather } from '../hooks/api/weather';
import { Notes } from '../components/Notes';
import { Loader } from '../components/Loader';
import { removeFavouriteCity, saveFavouriteCity } from '../helpers/cities';

type QueryParams = {
  cityId: string | undefined;
  isCurrentLocation?: boolean;
  isFavourite: boolean | undefined;
  lat: string | undefined;
  long: string | undefined;
};

export default function City() {
  const history = useHistory();
  const location = useLocation();

  const queryParams = qs.parse(location.search, {
    parseBooleans: true,
  }) as QueryParams;

  const queryClient = useQueryClient();
  const cityDetails = useCityDetails(queryParams.cityId);
  const weatherDetails = useCityWeather({
    coords: queryParams.lat + ',' + queryParams.long,
  });

  if (cityDetails.isLoading || weatherDetails.isLoading) {
    return <Loader />;
  }

  if (cityDetails.isError || weatherDetails.isError) {
    return <div>There was an error</div>;
  }

  const toggleFavourite = async () => {
    if (cityDetails.data && !queryParams.isCurrentLocation) {
      if (queryParams.isFavourite) {
        queryParams.isFavourite = false;
        await removeFavouriteCity(Number(queryParams.cityId));
      } else {
        queryParams.isFavourite = true;
        await saveFavouriteCity(cityDetails.data);
      }

      history.push(`${location.pathname}?${qs.stringify(queryParams)}`);
      queryClient.invalidateQueries(['cities', 'favourite']);
    }
  };

  return (
    <StyledCity>
      <Header />

      <main className="container">
        <div className="header">
          <div className="back" onClick={() => history.push('/')}>
            <IoIosArrowBack />
            <span>Back</span>
          </div>

          <h1>
            {cityDetails.data?.city}, {cityDetails.data?.country}
          </h1>
          <div className="time">
            {format(new Date(weatherDetails.data?.location.localtime!), 'h:mm b')}
          </div>
          <div className="day">
            {format(new Date(weatherDetails.data?.location.localtime!), 'EEEE, MMMM do')}
          </div>
        </div>

        <div className="showcase">
          <div className="showcase__left">
            <div className="temperature">
              <span>{weatherDetails.data?.current.temperature}</span>
              <span className="temp__icon">&#186;</span>
              <span>C</span>
            </div>

            <div className="feels__like">
              <span>Feels like</span>
              <div>
                <span>{weatherDetails.data?.current.feelslike}</span>
                <span className="temp__icon">&#186;</span>
                <span>C</span>
              </div>
            </div>
          </div>

          <div className="favourite" onClick={toggleFavourite}>
            {queryParams.isCurrentLocation ? (
              <HiStar color="#faee1c" />
            ) : queryParams.isFavourite ? (
              <HiStar color="#faee1c" />
            ) : (
              <IoMdStarOutline />
            )}
          </div>

          <div>
            <img
              className="weather__icon"
              src={weatherDetails.data?.current.weather_icons[0]}
              alt=""
            />

            <div className="weather__description">
              {weatherDetails.data?.current.weather_descriptions[0]}
            </div>
          </div>
        </div>

        <section className="metrics">
          <div className="metrics__left">Humidity</div>
          <div className="metrics__right">
            {weatherDetails.data?.current.humidity}&#37;
          </div>

          <div className="metrics__left">Visibility</div>
          <div className="metrics__right">
            {weatherDetails.data?.current.visibility}km
          </div>

          <div className="metrics__left">Wind Speed</div>
          <div className="metrics__right">
            {weatherDetails.data?.current.wind_speed}km/h
          </div>

          <div className="metrics__left">Cloud Cover</div>
          <div className="metrics__right">
            {weatherDetails.data?.current.cloudcover}&#37;
          </div>
        </section>

        <Notes cityId={queryParams.cityId!} />
      </main>
    </StyledCity>
  );
}

const StyledCity = styled.section`
  min-height: 100vh;
  position: relative;

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    margin-top: 3rem;

    h1 {
      font-size: 2.4rem;
      font-weight: 500;
      margin-bottom: 0.4rem;
    }
    .back {
      display: flex;
      cursor: pointer;

      svg {
        font-size: 1.15rem;
      }
    }
    .day {
      margin-bottom: 0.3rem;
      font-size: 1.1rem;
    }
    .time {
      margin-top: 0.5rem;
      margin-bottom: 0.3rem;
      font-size: 1.5rem;
      align-self: center;
    }
  }

  .showcase {
    background: #312d4e;
    border-radius: 19px;
    box-shadow: 20px 20px 60px #2a2642, -20px -20px 60px #38345a;
    margin-top: 3rem;
    max-width: 40rem;
    margin-left: auto;
    margin-right: auto;
    padding: 2rem;
    display: flex;
    gap: 2rem;
    justify-content: space-between;

    .showcase__left {
      display: flex;
      flex-direction: column;
    }

    .favourite {
      align-self: baseline;
      cursor: pointer;

      svg {
        font-size: 1.3rem;
      }
    }

    .temperature {
      font-size: 3rem;
      font-weight: 500;

      .temp__icon {
      }
    }
    .feels__like {
      display: flex;
      gap: 0.4rem;
      margin-top: auto;
      font-weight: 500;
    }
    .weather__icon {
      display: block;
      margin-left: auto;
      border-radius: 10px;
    }
    .weather__description {
      font-weight: 500;
      margin-top: 1rem;
      max-width: 12rem;
      text-align: end;
      line-height: 1.4;
    }
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.3rem;
    max-width: 20rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 3rem;
    font-weight: 500;

    .metrics__right {
      text-align: end;
    }
  }
`;
