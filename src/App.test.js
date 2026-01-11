import { render, screen } from '@testing-library/react';
import App from './App';

test('renders FireDanger heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /FireDanger/i });
  expect(headingElement).toBeInTheDocument();
});
