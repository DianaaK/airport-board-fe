import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { AppLayout } from './components/layout/AppLayout/AppLayout';
import { ErrorBoundary } from './components/ui/ErrorBoundary/ErrorBoundary';
import { NotFound } from './components/ui/NotFound/NotFound';
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
        Component: NotFound,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
