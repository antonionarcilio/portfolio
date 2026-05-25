import type { ReactNode } from 'react';

import { A11yProvider } from '@/contexts/a11y-context';

export default function GamerLayout({ children }: { children: ReactNode }) {
  return <A11yProvider>{children}</A11yProvider>;
}
