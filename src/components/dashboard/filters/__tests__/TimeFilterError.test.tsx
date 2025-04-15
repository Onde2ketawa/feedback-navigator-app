
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TimeFilterError } from '../TimeFilterError';

describe('TimeFilterError Component', () => {
  it('renders error message when provided', () => {
    const testError = new Error('Test error message');
    render(<TimeFilterError error={testError} />);
    
    expect(screen.getByText(/Unable to load time filters/)).toBeInTheDocument();
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();
  });
  
  it('renders nothing when no error is provided', () => {
    const { container } = render(<TimeFilterError error={null} />);
    expect(container.firstChild).toBeNull();
  });
});
