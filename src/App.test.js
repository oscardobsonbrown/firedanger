import { render, screen } from '@testing-library/react';
import App from './App';

test('renders FireDanger heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /FireDanger/i });
  expect(headingElement).toBeInTheDocument();
});

describe('Conto campfire rules', () => {
  const forecasts = require('./ftp_data.json');
  const districtIndex = require('./campgrounds.json').find(({ name }) => name === 'Conto')['district-id'];

  test.each([
    ['low', { danger: 'moderate', fdi: 18 }],
    ['missing', undefined],
    ['high', { danger: 'extreme', fdi: 90 }],
  ])('show the campground rules with %s district FDI', (_condition, forecast) => {
    const original = forecasts[districtIndex];
    const originalPath = window.location.pathname;
    forecasts[districtIndex] = forecast;
    window.history.replaceState(null, '', '/Conto');
    try {
      render(<App />);

      expect(screen.getByRole('heading', { name: 'Conto' })).toBeInTheDocument();
      expect(screen.getByText(/not permitted in the Isaacs area at any time/i)).toBeInTheDocument();
      expect(screen.getByText(/prohibited in the other areas.*typically mid-November to mid-April.*posted signs/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /DBCA/ })).toHaveAttribute('href', 'https://exploreparks.dbca.wa.gov.au/site/conto-campground');
      expect(screen.getByRole('link', { name: /Emergency WA/ })).toHaveAttribute('href', 'https://www.emergency.wa.gov.au/');
      expect(screen.getByRole('link', { name: /Check another location/ })).toHaveAttribute('href', '/');
      expect(screen.queryByText(/Campfire Status|✅/)).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: /moderate|extreme/i })).not.toBeInTheDocument();
    } finally {
      forecasts[districtIndex] = original;
      window.history.replaceState(null, '', originalPath);
    }
  });
});
