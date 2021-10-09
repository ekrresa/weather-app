import { createContext, PropsWithChildren, useContext, useState } from 'react';

type Temperature = {
  unit: 'celsius' | 'fahrenheit';
  handleUnitChange: (unit: 'celsius' | 'fahrenheit') => void;
};

const TemperatureContext = createContext<Temperature | null>(null);

export function useTemperatureContext() {
  const context = useContext(TemperatureContext);

  if (!context) {
    throw new Error('TemperatureContext was used outside of its Provider');
  }

  return context;
}

export function TemperatureProvider(props: PropsWithChildren<unknown>) {
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('fahrenheit');

  const handleUnitChange = (newUnit: 'celsius' | 'fahrenheit') => {
    setUnit(newUnit);
  };

  return (
    <TemperatureContext.Provider value={{ unit, handleUnitChange }}>
      {props.children}
    </TemperatureContext.Provider>
  );
}
