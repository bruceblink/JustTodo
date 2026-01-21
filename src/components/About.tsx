import { memo } from 'react';
import { Flex } from '@mantine/core';

function About() {
  return (
    <Flex align={'center'} justify={'center'} direction={'column'} gap={'md'}>
      "这是关于页面"
    </Flex>
  );
}

export default memo(About);
