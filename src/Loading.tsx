import { defaultAppSettings } from '@/settings/settingsSchema.ts';

function Loading() {
  const style = {
    width: '100%',
    height: '100vh',
    backgroundColor: defaultAppSettings.theme === 'dark' ? '#141517' : '#fff',
  };

  return (
    <>
      <div style={style}></div>
    </>
  );
}

export default Loading;
