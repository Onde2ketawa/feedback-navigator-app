
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeFilterReset } from '../TimeFilterReset';

describe('TimeFilterReset Component', () => {
  const mockResetFn = jest.fn();
  
  it('renders reset button correctly', () => {
    render(<TimeFilterReset onReset={mockResetFn} />);
    
    const resetButton = screen.getByRole('button', { name: /Reset Date Filters/i });
    expect(resetButton).toBeInTheDocument();
  });
  
  it('calls onReset when clicked', () => {
    render(<TimeFilterReset onReset={mockResetFn} />);
    
    const resetButton = screen.getByRole('button', { name: /Reset Date Filters/i });
    fireEvent.click(resetButton);
    
    expect(mockResetFn).toHaveBeenCalledTimes(1);
  });
});
