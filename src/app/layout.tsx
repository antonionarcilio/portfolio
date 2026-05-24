import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Personal portfolio',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="a11y-zoom-wrapper">{children}</div>
      </body>
    </html>
  );
}
