import { createBrowserRouter, Link } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { AppLayout } from './components/layout/AppLayout/AppLayout';
import { ErrorBoundary } from './components/ui/ErrorBoundary/ErrorBoundary';
import { FlightList } from './features/flights/components/FlightList/FlightList';

const router = createBrowserRouter([
  {
    Component: AppLayout,
    ErrorBoundary,
    children: [
      {
        index: true,
        Component: FlightList,
        ErrorBoundary,
      },
      {
        path: '*',
        element: (
          <>
            <h1>Page not found</h1>
            <Link to="/">Return to departures</Link>
          </>
        ),
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
