import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataStatus } from '../DataStatus';

const mockProps = { isLoading: false, isFetching: false, hasData: false, error: null };

describe('DataStatus', () => {
  it('shows the initial loading message', () => {
    render(<DataStatus {...mockProps} isLoading isFetching />);
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading data... Please wait.');
    expect(screen.queryByTestId('refreshing')).not.toBeInTheDocument();
  });

  it('shows a refresh message when existing flights are being refreshed', () => {
    render(<DataStatus {...mockProps} hasData isFetching />);
    expect(screen.getByTestId('refreshing')).toHaveTextContent('Refreshing data...');
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('explains initial load failure', () => {
    render(<DataStatus {...mockProps} error={new Error('offline')} />);
    expect(screen.getByTestId('error-title')).toHaveTextContent('Unable to load data.');
    expect(screen.getByTestId('error-text')).toHaveTextContent(
      'No data is available. Try again later.',
    );
  });

  it('warns about stale data after a failed refresh', () => {
    render(<DataStatus {...mockProps} hasData error={new Error('offline')} />);
    expect(screen.getByTestId('error-title')).toHaveTextContent('Data may be outdated.');
    expect(screen.getByTestId('error-text')).toHaveTextContent('Showing the last successful data.');
  });

  it('renders nothing when idle', () => {
    const { container } = render(<DataStatus {...mockProps} />);
    expect(container).toBeEmptyDOMElement();
  });
});
