import { Box } from '@mantine/core';
import { useSettingStore } from './hooks/useSettingStore';

function Loading() {
  const { theme } = useSettingStore();

  return <Box w="100%" h="100vh" bg={theme === 'dark' ? 'dark.8' : 'white'} />;
}

export default Loading;
