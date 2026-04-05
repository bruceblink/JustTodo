import packageJson from '../../package.json';

interface IFeatureFlags {
  updater: boolean;
  autostart: boolean;
}

const defaultFlags: IFeatureFlags = {
  updater: true,
  autostart: true,
};

const raw = packageJson as {
  scaffold?: {
    features?: Partial<IFeatureFlags>;
  };
};

export const featureFlags: IFeatureFlags = {
  updater: raw.scaffold?.features?.updater ?? defaultFlags.updater,
  autostart: raw.scaffold?.features?.autostart ?? defaultFlags.autostart,
};
