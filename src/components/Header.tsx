import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useTemperatureContext } from '../common/temperatureContext';

export function Header() {
  const temperatureCtx = useTemperatureContext();

  return (
    <StyledHeader unit={temperatureCtx.unit}>
      <div className="container wrapper">
        <Link to="/" className="logo" data-testid="logo">
          WeatherView
        </Link>
        <div className="temperature">
          <div
            className="fahrenheit"
            onClick={() => temperatureCtx.handleUnitChange('fahrenheit')}
            data-testid="fahrenheit-btn"
          >
            &#186;<span>F</span>
          </div>
          <div
            className="celsius"
            onClick={() => temperatureCtx.handleUnitChange('celsius')}
            data-testid="celsius-btn"
          >
            &#186;<span>C</span>
          </div>
        </div>
      </div>
    </StyledHeader>
  );
}

const StyledHeader = styled.header<{ unit: 'celsius' | 'fahrenheit' }>`
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

    .celsius,
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

    .celsius {
      background: #e2f3f5;
      color: #110e3c;
      margin-left: 1rem;
      ${props =>
        props.unit === 'celsius'
          ? css`
              box-shadow: 0 0 0 3px #b179d4;
            `
          : null}
    }
    .fahrenheit {
      background: #585676;
      color: #e7e7eb;
      width: 29px;
      height: 29px;
      ${props =>
        props.unit === 'fahrenheit'
          ? css`
              box-shadow: 0 0 0 3px #b0afbb;
            `
          : null}
    }
  }
`;
