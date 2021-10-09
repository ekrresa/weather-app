import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';
import { TemperatureProvider } from '../../common/temperatureContext';

describe('Header component', () => {
  beforeAll(() => {
    render(
      <MemoryRouter initialEntries={['/']} initialIndex={1}>
        <TemperatureProvider>
          <Header />
        </TemperatureProvider>
      </MemoryRouter>
    );
  });

  test('should render without errors', () => {
    const Logo = screen.getByTestId('logo');
    const FahrenheitBtn = screen.getByTestId('fahrenheit-btn');
    const CelsiusBtn = screen.getByTestId('celsius-btn');

    expect(Logo).toBeInTheDocument();
    expect(FahrenheitBtn).toBeInTheDocument();
    expect(CelsiusBtn).toBeInTheDocument();
  });
});
