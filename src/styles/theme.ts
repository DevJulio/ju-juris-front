import { createTheme } from '@mui/material/styles';
import { createGlobalStyle } from 'styled-components';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1a3a5c',
      light: '#2d5f8a',
      dark: '#0f2235',
    },
    secondary: {
      main: '#c8a951',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #f5f5f5;
    font-family: "Inter", "Roboto", "Helvetica", "Arial", sans-serif;
    color: #1a1a1a;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
