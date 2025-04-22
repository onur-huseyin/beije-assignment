'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const baseTheme = createTheme({
  typography: {
    fontFamily: 'Gordita',
    fontSize: 16,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: '#F6F2ED', // beije rengi
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': [
          {
            fontFamily: 'Gordita',
            src: `url('/font/Gordita-Regular.otf') format('opentype')`,
            fontWeight: 400,
            fontStyle: 'normal',
          },
          {
            fontFamily: 'Gordita',
            src: `url('/font/Gordita-Medium.otf') format('opentype')`,
            fontWeight: 500,
            fontStyle: 'normal',
          },
          {
            fontFamily: 'Gordita',
            src: `url('/font/Gordita-Bold.otf') format('opentype')`,
            fontWeight: 700,
            fontStyle: 'normal',
          },
        ],
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          boxSizing: 'border-box',
          WebkitTextSizeAdjust: '100%',
        },
        '*, *::before, *::after': {
          boxSizing: 'inherit',
        },
        body: {
          margin: 0,
          fontFamily: 'Gordita, Arial, sans-serif',
        },
      },
    },
  },
});

export const theme = responsiveFontSizes(baseTheme); 