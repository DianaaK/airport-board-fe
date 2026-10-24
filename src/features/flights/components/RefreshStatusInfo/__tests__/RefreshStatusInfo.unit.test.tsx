import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RefreshStatusInfo } from '../RefreshStatusInfo';

const mockProps = { isLoading: false, isFetching: false, hasFlights: false, error: null };

describe('RefreshStatusInfo', () => {
  it('shows the initial loading message', () => {
    render(<RefreshStatusInfo {...mockProps} isLoading isFetching />);
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading flights... Please wait.');
    expect(screen.queryByTestId('refreshing')).not.toBeInTheDocument();
  });

  it('shows a refresh message when existing flights are being refreshed', () => {
    render(<RefreshStatusInfo {...mockProps} hasFlights isFetching />);
    expect(screen.getByTestId('refreshing')).toHaveTextContent('Refreshing flights...');
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('explains initial load failure', () => {
    render(<RefreshStatusInfo {...mockProps} error={new Error('offline')} />);
    expect(screen.getByTestId('error-title')).toHaveTextContent('Unable to load flights.');
    expect(screen.getByTestId('error-text')).toHaveTextContent(
      'No flight data is available. Try refreshing again.',
    );
  });

  it('warns about stale data after a failed refresh', () => {
    render(<RefreshStatusInfo {...mockProps} hasFlights error={new Error('offline')} />);
    expect(screen.getByTestId('error-title')).toHaveTextContent(
      'Flight information may be outdated.',
    );
    expect(screen.getByTestId('error-text')).toHaveTextContent('Showing the last successful data.');
  });

  it('renders nothing when idle', () => {
    const { container } = render(<RefreshStatusInfo {...mockProps} />);
    expect(container).toBeEmptyDOMElement();
  });
});
