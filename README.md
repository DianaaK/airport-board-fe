# Airport flight board

React and TypeScript application that displays a flight status board for an airport.

## Implementation notes and AI usage

**Written by me vs. AI-generated:** Approximately 50% of the code was generated with AI and 50% was written by me. I used AI to scaffold the application using my proposed architecture, folder structure, and approach. I then implemented the shared foundations: configuration, reusable components, the API client and the main query hook.

I then asked AI to adapt the flights feature to use those shared modules. I also used it for refactoring, but that usually required fixes to match the intended design.

Styling was mostly AI-generated, with minor adjustments from me. I also used AI for code reviews and suggestions for improvements and fixes.

**Corrections to AI output:** I estimate that more than 80% of the generated code needed adjustments, refactoring, or improvements to match my intended approach. Common issues included overly complex solutions to individual problems and duplicated markup or styles that could be extracted into reusable components. For example:

- When adapting existing markup to a shared component I had extracted, AI missed certain scenarios that could have been updated or expanded the component to cover cases that should have remained handled separately.
- When asked to split a large component, AI did not always follow the requested component boundaries, so I adjusted the extractions.
- When creating the flight details map, AI initially used a different package from the one I requested.
- When asked to refactor the styling and use the common CSS variables, AI introduced unnecessary new variables instead of reusing similar values.

**Decisions I would revisit:** I would improve the custom `useQuery` implementation, starting with a request timeout: a request that never settles currently blocks subsequent refreshes. I would also strengthen query-key handling, since at the moment a key change can briefly expose the previous resource's state. Finally, I would split some components that still handle too many responsibilities.

## Architecture

I created the project following my own feature-based folder structure, inspired by [Bulletproof React](https://github.com/alan2207/bulletproof-react). Flight-specific code stays inside its feature; reusable UI and generic hooks are shared.

```text
src/
  assets/locales/     # English and Romanian translations
  components/         # Shared UI, layouts, and icons
  config/             # Environment configuration
  features/flights/   # Flight API calls, models, hooks, components, and utilities
  hooks/              # Generic hooks shared across features
  lib/                # Fetch client and external package setup
  pages/              # Page composition and component coordination
  styles/             # Shared design variables
  test/               # Shared test setup and MSW server
  types/              # General API types
```

## Running locally

```sh
npm install
```

Copy `.env.example` to `.env` and choose one of the configurations below. Then start the frontend:

```sh
npm run dev
```

Restart Vite after changing environment variables.

**With mock data:** To run without the local backend, use the hosted DummyJSON responses:

```dotenv
VITE_API_MODE=dummyjson
```

DummyJSON is the default when `VITE_API_MODE` is unset or the values from .env.example are used. Responses are static, so refreshing does not produce changing flight data. The details endpoint returns the same sample flight regardless of the selected ID. `VITE_API_URL` is unused in this mode.

**With the local backend:** I created a small [NestJS backend](https://github.com/DianaaK/airport-board-be) to test error flows and adjust sample data without adding complexity to the frontend. Follow that repository's setup instructions, start its API, and configure the frontend:

```dotenv
VITE_API_MODE=local
VITE_API_URL=http://localhost:3000
```

Adjust the URL to match the backend. The frontend calls `GET /flights` and `GET /flights/:id`. The backend must allow requests from the frontend origin through CORS.

## Additional packages

- **React Router** (`react-router`): application routing and route error handling.
- **i18next / react-i18next**: English and Romanian translations and localized formatting.
- **React Leaflet / Leaflet**: Flight route maps using OpenStreetMap tiles.

## Styling

I chose CSS Modules and reusable UI components to avoid adding a styling library for this project. CSS variables define shared colors, spacing, and typography; component-specific values stay in their own stylesheets. For a larger application, I would normally opt for an established component library such as MUI.

## Testing

Tests use Vitest, React Testing Library, and MSW. HTTP requests are intercepted in tests, so a running backend is not required.

```sh
npm test                 # Run the test suite
npm run coverage         # Run tests and generate coverage
npm run coverage-report  # Open the generated coverage report
```

Run `npm run coverage` before opening the report.
