// Color Scheme Constants
// Update these colors in one place to change across the entire site

// Homepage Color Scheme
export const HOME_COLORS = {
  background: '#111111',
  primaryRed: '#FF4C4C',
  secondaryRed: '#A62424',
  text: '#FFFFFF',
  accentGray: '#333333',
} as const;

// Other Pages Color Scheme
export const PAGE_COLORS = {
  background: '#0F1C26',
  primaryBlue: '#1E88E5',
  secondaryBlue: '#1565C0',
  text: '#FFFFFF',
  accentGray: '#263238',
} as const;

// Utility function to get CSS custom properties
export const getCSSVariables = (scheme: 'home' | 'pages') => {
  if (scheme === 'home') {
    return {
      '--bg-primary': HOME_COLORS.background,
      '--color-primary': HOME_COLORS.primaryRed,
      '--color-secondary': HOME_COLORS.secondaryRed,
      '--color-text': HOME_COLORS.text,
      '--color-accent': HOME_COLORS.accentGray,
    };
  }
  return {
    '--bg-primary': PAGE_COLORS.background,
    '--color-primary': PAGE_COLORS.primaryBlue,
    '--color-secondary': PAGE_COLORS.secondaryBlue,
    '--color-text': PAGE_COLORS.text,
    '--color-accent': PAGE_COLORS.accentGray,
  };
};
