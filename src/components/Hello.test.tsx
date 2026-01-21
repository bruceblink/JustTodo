import { render, screen } from '@testing-library/react';
import { Hello } from './Hello';

describe('Hello component', () => {
  it('renders default greeting', () => {
    render(<Hello />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('renders custom greeting', () => {
    render(<Hello name="Kanug" />);
    expect(screen.getByText('Hello, Kanug!')).toBeInTheDocument();
  });
});
