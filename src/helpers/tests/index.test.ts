import { convertFahrenheitToCelsius, extractCoordinates } from '..';
import cities from './cities.json';

describe('convertFahrenheitToCelsius', () => {
  test('should convert negative fahrenheit values to celsius correctly', () => {
    const celsiusVal = convertFahrenheitToCelsius(-40);
    expect(celsiusVal).toBe(-40);
  });

  test('should convert zero fahrenheit value to celsius correctly', () => {
    const celsiusVal = convertFahrenheitToCelsius(0);
    expect(celsiusVal).toBe(-18);
  });

  test('should convert positive fahrenheit values to celsius correctly', () => {
    const celsiusVal = convertFahrenheitToCelsius(50);
    expect(celsiusVal).toBe(10);
  });
});

describe('extractCoordinates', () => {
  test('should extract coordinates in the right format', () => {
    const coordinates = extractCoordinates(cities);

    coordinates.forEach(city => {
      expect(typeof city.cityId).toBe('number');
      expect(city.coords.includes(',')).toBeTruthy();
    });
  });
});
