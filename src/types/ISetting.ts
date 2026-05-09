import React, { MemoExoticComponent } from 'react';
import { DispatchType } from './IEvents.ts';

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
  allowAutoStartUp: boolean;
}

export interface ISettingStoreState extends ISettingStoreVariables {
  hydrated: boolean;
  setLanguage: (newLanguage: string) => void;
  setTheme: (newTheme: ColorScheme) => void;
  setAllowAutoStartUp: (newBoolean: boolean) => void;
  initSettings: () => Promise<void>;
}

export interface ISettingsContent {
  title: string;
  description: string;
  checked: boolean;
  dispatchType: DispatchType;
  component?: React.ReactNode;
}

export interface SettingButtonProps {
  title: string;
  description: string;
  btnLabel: string;
  btnFunction: () => void;
}
