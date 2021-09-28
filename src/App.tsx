import { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Loader } from './components/Loader';

const Homepage = lazy(() => import('./pages'));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path="/">
          <Homepage />
        </Route>
      </Switch>
    </Suspense>
  );
}

export default App;
