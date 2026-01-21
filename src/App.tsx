import { Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import Loading from './Loading.tsx';
import { ColorSchemeType } from './types/ISetting.ts';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <MantineProvider
                defaultColorScheme={ColorSchemeType.Dark}
                theme={{
                  fontFamily:
                    'cursive, Siemreap, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
                  colors: {
                    dark: [
                      '#C1C2C5',
                      '#A6A7AB',
                      '#909296',
                      '#5C5F66',
                      '#373A40',
                      '#2C2E33',
                      '#1A1B1E',
                      '#141517',
                      '#1A1B1E',
                      '#101113',
                    ],
                  },
                }}
              ></MantineProvider>
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
