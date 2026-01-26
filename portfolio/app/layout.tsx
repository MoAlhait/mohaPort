import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mohammad Alhait - Cognitive Science | UC Berkeley 2028',
  description: 'Junior Transfer Cognitive Science major at UC Berkeley (graduating 2028). AI-powered tool development, self-led cognition research, React portfolios. Cupertino, CA.',
  keywords: ['cognitive science', 'UC Berkeley', 'Cursor', 'AI tools', 'cognition research', 'React', 'mohammad-alhait'],
  authors: [{ name: 'Mohammad Alhait' }],
  creator: 'Mohammad Alhait',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Mohammad Alhait - Cognitive Science | UC Berkeley 2028',
    description: 'Cognitive Science at UC Berkeley. AI-powered development, cognition research, React. mohammad-alhait.com',
    type: 'website',
    locale: 'en_US',
    url: 'https://mohammad-alhait.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammad Alhait - Cognitive Science | UC Berkeley 2028',
    description: 'Cognitive Science at UC Berkeley. AI-powered development, cognition research, React. mohammad-alhait.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
} 