import { memo } from 'react';
import { Flex, Text } from '@mantine/core';

function Home() {
  return (
    <Flex align={'center'} justify={'center'} direction={'column'} gap={'md'}>
      <Text c="dimmed">This is the Home page.</Text>
    </Flex>
  );
}

export default memo(Home);
