'use client';

import { ThemeProvider } from './ThemeProvider';

const providers = [ThemeProvider];

export function Providers({ children }: { children: React.ReactNode }) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}