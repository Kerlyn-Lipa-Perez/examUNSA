import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../components/Providers';
import localFont from 'next/font/local';

const spaceGrotesk = localFont({
  src: [
    {
      path: '../font/SpaceGrotesk-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../font/SpaceGrotesk-Bold.ttf',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-space',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: [
    {
      path: '../font/JetBrainsMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../font/JetBrainsMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Combo UNSA',
  description: 'Simulacros y Flashcards para el examen UNSA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
