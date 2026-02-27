import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingConnect from '@/components/FloatingConnect';
import { getSite } from '@/lib/api';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Venusescort — A Standards-Based Collective of Untamed Muses',
  description: 'A standards-based collective of untamed muses.',
  openGraph: {
    title: 'Venusescort — A Standards-Based Collective of Untamed Muses',
    description: 'A standards-based collective of untamed muses.',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default async function RootLayout({ children }) {
  const site = await getSite();
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scrollbar-hide`}>
      <body className="font-sans overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <Footer site={site} />
        <FloatingConnect site={site} />
      </body>
    </html>
  );
}
