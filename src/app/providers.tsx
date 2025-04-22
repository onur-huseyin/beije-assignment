'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { store } from '@/store/store';
import { theme } from './theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </Provider>
  );
} 