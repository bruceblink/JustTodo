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

export interface ISettingStoreVariables {
  language: string;
  theme: ColorScheme;
}

export interface ISettingStoreState extends ISettingStoreVariables {
  setLanguage: (newLanguage: string) => void;
  setTheme: (newTheme: ColorScheme) => void;
}
