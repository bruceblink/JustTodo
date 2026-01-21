import React, { MemoExoticComponent } from 'react';

export type ColorScheme = ColorSchemeType.Light | ColorSchemeType.Dark;

export enum ColorSchemeType {
  Light = 'light',
  Dark = 'dark',
}

export enum ESettingTab {
  Home = 0,
  Settings = 1,
  About = 2,
}

export interface SideNavBarTabs {
  Component: MemoExoticComponent<() => JSX.Element>;
  Icon: React.ReactNode;
  label: string;
  tab: ESettingTab;
}
