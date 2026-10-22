import { BrowserRouter, Link, Route, Routes } from 'react-router';

import { AppLayout } from './components/layouts/AppLayout';
import { FlightList } from './features/flights/components/FlightList';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<FlightList />} />
          <Route
            path="*"
            element={
              <>
                <h1>Page not found</h1>
                <Link to="/">Return to departures</Link>
              </>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
