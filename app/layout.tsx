import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StatusBoard - Signal Your Availability',
  description: 'Instantly signal your availability and showcase your services.',
  openGraph: {
    title: 'StatusBoard',
    description: 'Instantly signal your availability and showcase your services.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="floating-elements">
            <div className="floating-element w-8 h-8 bg-purple-500 rounded-lg" style={{ left: '10%', animationDelay: '0s' }} />
            <div className="floating-element w-6 h-6 bg-blue-500 rounded-full" style={{ left: '20%', animationDelay: '5s' }} />
            <div className="floating-element w-10 h-10 bg-cyan-500 rounded-lg" style={{ left: '30%', animationDelay: '10s' }} />
            <div className="floating-element w-4 h-4 bg-pink-500 rounded-full" style={{ left: '40%', animationDelay: '15s' }} />
            <div className="floating-element w-8 h-8 bg-indigo-500 rounded-lg" style={{ left: '60%', animationDelay: '3s' }} />
            <div className="floating-element w-6 h-6 bg-teal-500 rounded-full" style={{ left: '70%', animationDelay: '8s' }} />
            <div className="floating-element w-12 h-12 bg-purple-400 rounded-lg" style={{ left: '80%', animationDelay: '12s' }} />
            <div className="floating-element w-5 h-5 bg-blue-400 rounded-full" style={{ left: '90%', animationDelay: '18s' }} />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
