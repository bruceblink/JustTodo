import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.ts';
import '@mantine/core/styles.css';
import { useSettingStore } from '@/hooks/useSettingStore.tsx';
import { useTodoStore } from '@/hooks/useTodoStore.ts';

// prevent right click menu
document.addEventListener('contextmenu', (e) => e.preventDefault());

async function bootstrap() {
  try {
    const { initSettings } = useSettingStore.getState();
    const { initTodos } = useTodoStore.getState();

    await Promise.all([initSettings(), initTodos()]);

    const { language } = useSettingStore.getState();
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Failed to hydrate app state from store', error);
  }

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </React.StrictMode>,
  );
}

void bootstrap();
