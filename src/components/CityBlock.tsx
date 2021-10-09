import { SyntheticEvent } from 'react';
import { UseQueryResult } from 'react-query';
import { Link } from 'react-router-dom';
import { BiTrash } from 'react-icons/bi';
import { IoMdStarOutline } from 'react-icons/io';
import { HiStar } from 'react-icons/hi';
import ClipLoader from 'react-spinners/ClipLoader';
import styled, { css } from 'styled-components';

import { City, WeatherResponse } from '../types';
import { useTemperatureContext } from '../common/temperatureContext';
import { convertFahrenheitToCelsius } from '../helpers';

type CityBlockProps = {
  city: City;
  isFavourite: boolean;
  weather: UseQueryResult<WeatherResponse>;
  removeCity: (e: SyntheticEvent, cityId: number) => void;
  removeFavourite?: (e: SyntheticEvent, cityId: number) => void;
  setFavourite: (e: SyntheticEvent, cityId: number) => void;
};

export function CityBlock({
  city,
  isFavourite,
  removeCity,
  removeFavourite,
  setFavourite,
  weather,
}: CityBlockProps) {
  const temperatureCtx = useTemperatureContext();

  return (
    <StyledCityBlock
      isFavourite={isFavourite}
      to={`/city?cityId=${city.id}&lat=${city.latitude}&long=${city.longitude}&isFavourite=${isFavourite}`}
    >
      <h3>{city.name}</h3>

      <div className="overlay">
        {isFavourite ? (
          <span
            className="favorite"
            onClick={e => {
              if (removeFavourite) {
                removeFavourite(e, city.id);
              }
            }}
          >
            <HiStar />
          </span>
        ) : (
          <span className="favorite" onClick={e => setFavourite(e, city.id)}>
            <IoMdStarOutline />
          </span>
        )}

        {!isFavourite && (
          <span className="trash" onClick={e => removeCity(e, city.id)}>
            <BiTrash />
          </span>
        )}
      </div>

      {weather?.isSuccess && weather?.data ? (
        <>
          <p className="temp">
            <span className="value">
              {temperatureCtx.unit === 'celsius'
                ? convertFahrenheitToCelsius(weather.data?.current?.temperature)
                : weather.data?.current?.temperature}
            </span>
            &#186;
            <span>{temperatureCtx.unit === 'fahrenheit' ? 'F' : 'C'}</span>
          </p>
          <p className="summary" title={weather?.data?.current?.weather_descriptions[0]}>
            {weather?.data?.current?.weather_descriptions[0]}
          </p>
        </>
      ) : weather?.isError ? (
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Error fetching current location. Please reload.
        </div>
      ) : (
        <span style={{ marginTop: 'auto' }}>
          <ClipLoader color="#f3558e" size={15} />
        </span>
      )}
    </StyledCityBlock>
  );
}

const StyledCityBlock = styled(Link)<{ isFavourite: boolean }>`
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background: #1e213a;
  color: #e7e7eb;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s ease;
  ${props =>
    props.isFavourite
      ? css`
          border: 2px solid #faee1c;
        `
      : css`
          border: 2px solid #69557d;
        `}

  &:hover {
    transform: scale(1.1);

    .overlay {
      display: flex;
      align-items: center;
    }
  }

  h3 {
    margin-top: 0.7rem;
    margin-bottom: 1rem;
    font-size: 1.4rem;
    font-weight: 500;
  }

  .overlay {
    ${props =>
      props.isFavourite
        ? css`
            display: flex;
            align-items: center;
          `
        : css`
            display: none;
          `}

    position: absolute;
    isolation: isolate;
    right: 3%;
    top: 1%;
    z-index: 10;

    .favorite {
      padding: 0.3rem;
      margin-right: 0.3rem;

      svg {
        font-size: 1.4rem;
        fill: #faee1c;
      }
    }
    .trash {
      svg {
        font-size: 1.3rem;
        fill: #ffb17f;
      }
    }
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

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
