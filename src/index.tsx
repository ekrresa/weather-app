import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TemperatureProvider } from './common/temperatureContext';

const ONE_DAY_IN_MILLISECONDS = 86_400_000;

const localStoragePersistor = createWebStoragePersistor({ storage: window.localStorage });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: ONE_DAY_IN_MILLISECONDS,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

persistQueryClient({
  persistor: localStoragePersistor,
  queryClient,
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TemperatureProvider>
            <App />
          </TemperatureProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
    </Router>
    <Toaster />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
