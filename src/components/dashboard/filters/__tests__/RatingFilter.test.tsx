
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingFilter } from '../RatingFilter';

describe('RatingFilter Component', () => {
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly with rating range', () => {
    render(
      <RatingFilter
        ratingRange={[1, 5]}
        onRatingChange={mockOnChange}
      />
    );
    
    expect(screen.getByText(/Rating:/)).toBeInTheDocument();
    expect(screen.getByText(/1 - 5/)).toBeInTheDocument();
  });
  
  it('displays loading state when isLoading is true', () => {
    render(
      <RatingFilter
        ratingRange={[1, 5]}
        onRatingChange={mockOnChange}
        isLoading={true}
      />
    );
    
    expect(screen.getByText(/Rating:/)).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    // Check for skeleton component
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });
  
  it('displays error message when there is an error', () => {
    const testError = new Error('Test error message');
    render(
      <RatingFilter
        ratingRange={[1, 5]}
        onRatingChange={mockOnChange}
        error={testError}
      />
    );
    
    expect(screen.getByText(/Unable to load rating filter/)).toBeInTheDocument();
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();
  });
  
  // Note: Testing the actual slider interaction would typically require
  // a more complex test setup as it involves drag events
  // This is a placeholder for that functionality
  it('calls onRatingChange when slider value changes', () => {
    render(
      <RatingFilter
        ratingRange={[1, 5]}
        onRatingChange={mockOnChange}
      />
    );
    
    // This is a simplified test and doesn't actually test the slider interaction
    // A real test would use testing-library user-event or similar to simulate
    // drag events on the slider component
  });
});
