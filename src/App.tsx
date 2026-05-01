// src/App.tsx
import { Suspense } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import Loading from './Loading';
import MainWindow from './components/MainWindow';
import { useSettingStore } from './hooks/useSettingStore';

function App() {
  const { theme } = useSettingStore();

  return (
    <Suspense fallback={<Loading />}>
      <MantineProvider
        forceColorScheme={theme}
        theme={{
          fontFamily:
            'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          primaryColor: 'gray',
          defaultRadius: 'sm',
          colors: {
            dark: [
              '#f3f4f6',
              '#d1d5db',
              '#9ca3af',
              '#6b7280',
              '#374151',
              '#1f2937',
              '#161b22',
              '#11151b',
              '#0d1117',
              '#090c10',
            ],
          },
          components: {
            Card: {
              defaultProps: {
                withBorder: true,
                radius: 'md',
              },
            },
            Button: {
              defaultProps: {
                radius: 'sm',
              },
            },
            ActionIcon: {
              defaultProps: {
                radius: 'sm',
              },
            },
          },
        }}
      >
        <Notifications position="top-center" limit={2} />
        <ModalsProvider>
          <MainWindow />
        </ModalsProvider>
      </MantineProvider>
    </Suspense>
  );
}

export default App;
