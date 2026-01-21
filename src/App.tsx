// src/App.tsx
import { Suspense } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import Loading from './Loading';
import MainWindow from './components/MainWindow';
import { ColorSchemeType } from './types/ISetting';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <MantineProvider
        defaultColorScheme={ColorSchemeType.Dark}
        theme={{
          fontFamily:
            'cursive, Siemreap, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
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
      >
        {/* 全局能力，只挂一次 */}
        <Notifications position="top-center" limit={2} />
        <ModalsProvider>
          {/* 桌面主窗口 */}
          <MainWindow />
        </ModalsProvider>
      </MantineProvider>
    </Suspense>
  );
}

export default App;
