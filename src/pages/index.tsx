import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiStar } from 'react-icons/fi';
import styled from 'styled-components';

import { useGetCities } from '../hooks/api/cities';
import { extractCoordinates } from '../helpers';
import { useGetCityWeather } from '../hooks/api/weather';
import { Header } from '../components/Header';

export default function Home() {
  const [locations, setLocations] = useState<any[]>([]);
  const cities = useGetCities();
  const weather = useGetCityWeather(locations);

  useEffect(() => {
    if (cities.data) {
      const str = extractCoordinates(cities.data.data);
      setLocations(str);
    }
  }, [cities.data]);

  if (!cities.data) {
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
          <button>
            <FiStar />
            <span>Favorites</span>
          </button>
        </div>

        <div className="locations">
          {cities.data?.data.map((city, index) => (
            <Link
              to={`/city?cityId=${city.id}&lat=${city.latitude}&long=${city.longitude}`}
              className="location"
              key={city.id}
            >
              <h3>{city.name}</h3>

              {weather[index]?.isSuccess && weather[index]?.data ? (
                <p className="temp">
                  <span className="value">
                    {weather[index].data?.current?.temperature}
                  </span>
                  &#186;
                  <span>C</span>
                </p>
              ) : (
                <p className="temp">loading...</p>
              )}

              <p className="summary">
                {weather[index]?.data?.current?.weather_descriptions[0]}
              </p>
            </Link>
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
    margin-top: 3rem;
    margin-bottom: 2rem;

    h2 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    button {
      color: #e7e7eb;
      background: #100e1d;
      border: 1px solid #585676;
      display: flex;
      align-items: flex-end;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.38rem 0.9rem;
      border-radius: 4px;

      span {
        margin-left: 0.3rem;
      }
    }
  }

  .locations {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(min(11rem, 100%), 1fr));
    padding-bottom: 4rem;
  }

  .location {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    background: #1e213a;
    color: #e7e7eb;
    border-radius: 4px;
    padding: 1rem;
    text-align: center;
    border: 1px solid #643399;
    box-shadow: 0px 6px 10px 0px hsla(0, 0%, 0%, 0.14),
      0px 1px 18px 0px hsla(0, 0%, 0%, 0.12), 0px 3px 5px -1px hsla(0, 0%, 0%, 0.2);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }

    h3 {
      margin-top: 0.7rem;
      margin-bottom: 1rem;
      font-size: 1.4rem;
      font-weight: 500;
    }

    .value {
      font-size: 1.2rem;
      margin-right: 0.2rem;
    }

    .temp {
      font-size: 1.4rem;
      font-weight: 500;
      margin-top: auto;
      margin-bottom: 0;
    }

    .summary {
      font-size: 0.8rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
  }
`;
