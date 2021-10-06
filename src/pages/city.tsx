import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { GoPencil } from 'react-icons/go';
import styled from 'styled-components';

import { Header } from '../components/Header';
import { useCityDetails } from '../hooks/api/cities';
import { useCityWeather } from '../hooks/api/weather';
import { TextArea } from '../components/TextArea';

export default function City() {
  const queryParams = new URLSearchParams(useLocation().search);
  const [formState, toggleForm] = useState(false);

  const cityDetails = useCityDetails(queryParams.get('cityId')!);
  const weatherDetails = useCityWeather({
    coords: queryParams.get('lat')! + ',' + queryParams.get('long')!,
  });

  if (cityDetails.isLoading || weatherDetails.isLoading) {
    return <div>Fetching info...</div>;
  }

  if (cityDetails.isError || weatherDetails.isError) {
    return <div>There was an error</div>;
  }

  return (
    <StyledCity>
      <Header />

      <main className="container">
        <div className="header">
          <h1>
            {cityDetails.data?.data.city}, {cityDetails.data?.data.country}
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

          <div className="">
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

        <section className="notes">
          <div className="notes__header">
            <h3>Notes</h3>
            <span onClick={() => toggleForm(!formState)}>
              <GoPencil />
            </span>
          </div>

          {formState && (
            <form className="notes__form">
              <TextArea onChange={() => {}} />
              <button>save</button>
            </form>
          )}

          <div className="notes__list">
            {new Array(6).fill('ha').map((_, index) => (
              <div className="note" key={index}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus quo
                similique distinctio omnis dolor asperiores recusandae, dolores odio ut
                necessitatibus voluptatem fugit architecto ducimus. Nulla repellendus
                praesentium facere iure libero!
              </div>
            ))}
          </div>
        </section>
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
    .day {
      margin-bottom: 0.3rem;
      font-size: 1.1rem;
    }
    .time {
      margin-top: 0.5rem;
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
      margin-top: 0.5rem;
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

  .notes {
    margin-top: 3rem;

    .notes__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 35rem;
      margin-left: auto;
      margin-right: auto;

      h3 {
        font-size: 1.5rem;
      }

      span {
        cursor: pointer;
        padding: 0.8rem 0;

        svg {
          font-size: 1.2rem;
        }
      }
    }

    .notes__form {
      max-width: 27rem;
      margin-left: auto;
      margin-right: auto;
      padding: 1rem;
      margin-bottom: 3rem;

      button {
        width: 100%;
        margin-top: 0.4rem;
        padding: 0.7rem 0.3rem;
        text-transform: uppercase;
        font-weight: 600;
        background: #9e579d;
        border: 1px solid #9e579d;
        color: #fff;
        border-radius: 1px;
      }
    }

    .notes__list {
      display: grid;
      gap: 2rem;
      grid-template-columns: repeat(auto-fit, minmax(min(13rem, 100%), 1fr));
      max-width: 40rem;
      margin-left: auto;
      margin-right: auto;
      padding-bottom: 5rem;

      .note {
        border: 1px solid rebeccapurple;
        padding: 1rem;
        border-radius: 5px;
      }
    }
  }
`;
