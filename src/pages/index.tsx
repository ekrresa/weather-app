import styled from 'styled-components';
import { format } from 'date-fns';
import { FiStar } from 'react-icons/fi';

export default function Home() {
  return (
    <StyledHome>
      <header className="header">
        <div className="container wrapper">
          <div className="logo">WeatherView</div>
          <div className="temperature">
            <div className="celcius">
              &#186;<span>C</span>
            </div>
            <div className="fahrenheit">
              &#186;<span>F</span>
            </div>
          </div>
        </div>
      </header>

      <div className="today">{format(new Date(), 'EEE, d MMM')}</div>

      <div className="current container">
        <button className="current__location">View Current Location</button>
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
          <div className="location">
            <h3>New York</h3>
            <p>
              <span className="value">84</span>
              &#186;
              <span>C</span>
            </p>
            <p className="summary">Sunny</p>
          </div>

          <div className="location">
            <h3>Monaco</h3>
            <p className="temp">
              <span className="value">84</span>
              &#186;<span>C</span>
            </p>
            <p className="summary">Sunny</p>
          </div>
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

      .celcius {
        background: #e7e7eb;
        color: #110e3c;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
      }
      .fahrenheit {
        border-radius: 50%;
        background: #585676;
        color: #e7e7eb;
        margin-left: 1rem;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
      }
    }
  }

  .today {
    font-size: 1.9rem;
    text-align: center;
    font-weight: 500;
    padding: 1.5rem;
  }

  .current {
    text-align: center;
    margin-top: 3.5rem;

    .current__location {
      background: #1e213a;
      color: #e7e7eb;
      padding: 0.7rem 1.5rem;
      border-radius: 0.7rem;
      -webkit-appearance: button;
      border: 1px solid rebeccapurple;
    }
  }

  .location__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
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
  }

  .location {
    background: #1e213a;
    color: #e7e7eb;
    border-radius: 4px;
    padding: 1rem;
    text-align: center;
    box-shadow: 0px 6px 10px 0px hsla(0, 0%, 0%, 0.14),
      0px 1px 18px 0px hsla(0, 0%, 0%, 0.12), 0px 3px 5px -1px hsla(0, 0%, 0%, 0.2);

    h3 {
      margin-top: 0.7rem;
      margin-bottom: 0;
      font-size: 1.4rem;
    }

    .value {
      font-size: 1.2rem;
      margin-right: 0.2rem;
    }

    .temp {
      font-size: 1.4rem;
      font-weight: 500;
      margin-top: 0.5rem;
      margin-bottom: 0;
    }

    .summary {
      font-size: 0.8rem;
      font-weight: 500;
    }
  }
`;
