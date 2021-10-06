import { Link } from 'react-router-dom';
import styled from 'styled-components';

export function Header() {
  return (
    <StyledHeader>
      <div className="container wrapper">
        <Link to="/" className="logo">
          WeatherView
        </Link>
        <div className="temperature">
          <div className="celsius">
            &#186;<span>C</span>
          </div>
          <div className="fahrenheit">
            &#186;<span>F</span>
          </div>
        </div>
      </div>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
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
      background: #e7e7eb;
      color: #110e3c;
    }
    .fahrenheit {
      background: #585676;
      color: #e7e7eb;
      margin-left: 1rem;
    }
  }
`;
