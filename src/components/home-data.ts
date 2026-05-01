export interface UsageItem {
  label: string;
  value: string;
  progress: number;
}

export interface ProjectItem {
  name: string;
  domain: string;
  repo: string;
  commit: string;
  updated: string;
  branch: string;
  status: 'healthy' | 'warning';
}

export const usageItems: UsageItem[] = [
  { label: 'Edge Requests', value: '1.6K / 1M', progress: 12 },
  { label: 'Fast Data Transfer', value: '2.23 MB / 100 GB', progress: 3 },
  { label: 'Fast Origin Transfer', value: '0 / 10 GB', progress: 0 },
  { label: 'Edge Request CPU Duration', value: '0 / 1h', progress: 0 },
];

export const projects: ProjectItem[] = [
  {
    name: 'fast-analytics',
    domain: 'fast-analytics-pearl.vercel.app',
    repo: 'bruceblink/fast-analytics',
    commit: 'chore: clean unused import',
    updated: '12/14/25',
    branch: 'main',
    status: 'healthy',
  },
  {
    name: 'next-tv',
    domain: 'next-tv-sepia.vercel.app',
    repo: 'bruceblink/NextTV',
    commit: 'refactor: simplify landing page and remove extra hero elements',
    updated: '9/21/25',
    branch: 'main',
    status: 'healthy',
  },
  {
    name: 'notion-next',
    domain: 'blog.likang.top',
    repo: 'bruceblink/NotionNext',
    commit: 'chore: remove unnecessary theme',
    updated: '8/23/25',
    branch: 'main',
    status: 'warning',
  },
  {
    name: 'n-gon',
    domain: 'n-gon-azure.vercel.app',
    repo: 'bruceblink/n-gon',
    commit: 'quick bug fix',
    updated: '12/9/25',
    branch: 'master',
    status: 'healthy',
  },
  {
    name: 'nextjs-dashboard',
    domain: 'nextjs-dashboard-nine-ashen.vercel.app',
    repo: 'bruceblink/nextjs-dashboard',
    commit: 'docs: update readme and default login account',
    updated: '9/13/25',
    branch: 'dev',
    status: 'healthy',
  },
  {
    name: 'material-kit-react',
    domain: 'material-kit-react-rose.vercel.app',
    repo: 'bruceblink/material-kit-react',
    commit: 'docs: update readme page urls',
    updated: '9/6/25',
    branch: 'master',
    status: 'healthy',
  },
];
