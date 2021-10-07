import { Link } from 'react-router-dom';
import { BiTrash } from 'react-icons/bi';
import { IoMdStarOutline } from 'react-icons/io';
import { HiStar } from 'react-icons/hi';
import styled, { css } from 'styled-components';

import { City, WeatherResponse } from '../types';
import { UseQueryResult } from 'react-query';
import { SyntheticEvent } from 'react';

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
  return (
    <StyledCityBlock
      isFavourite={isFavourite}
      to={`/city?cityId=${city.id}&lat=${city.latitude}&long=${city.longitude}`}
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
        <p className="temp">
          <span className="value">{weather.data?.current?.temperature}</span>
          &#186;
          <span>C</span>
        </p>
      ) : (
        <p className="temp">loading...</p>
      )}

      <p className="summary">{weather?.data?.current?.weather_descriptions[0]}</p>
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
  }
`;