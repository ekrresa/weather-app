import { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Loader } from './components/Loader';

const Homepage = lazy(() => import('./pages'));
const City = lazy(() => import('./pages/city'));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path="/" exact>
          <Homepage />
        </Route>
        <Route path="/city">
          <City />
        </Route>
      </Switch>
    </Suspense>
  );
}

export default App;
