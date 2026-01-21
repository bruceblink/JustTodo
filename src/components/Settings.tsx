import { memo } from 'react';
import { Flex } from '@mantine/core';

function Settings() {
  return (
    <Flex align={'center'} justify={'center'} direction={'column'} gap={'md'}>
      "这是Settings页面"
    </Flex>
  );
}

export default memo(Settings);
