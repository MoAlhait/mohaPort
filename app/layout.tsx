import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mohammad Alhait - Cognitive Science Student | Aspiring Product Manager',
  description: 'Cognitive Science student at UC Berkeley with a passion for understanding human behavior and creating meaningful product experiences. Combining customer service expertise with creative skills to build products that truly serve people.',
  keywords: ['product manager', 'cognitive science', 'UC Berkeley', 'user research', 'product strategy', 'UX design', 'customer experience'],
  authors: [{ name: 'Mohammad Alhait' }],
  creator: 'Mohammad Alhait',
  openGraph: {
    title: 'Mohammad Alhait - Cognitive Science Student | Aspiring Product Manager',
    description: 'Cognitive Science student at UC Berkeley with a passion for understanding human behavior and creating meaningful product experiences.',
    type: 'website',
    locale: 'en_US',
    url: 'https://mohammad-alhait.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammad Alhait - Cognitive Science Student | Aspiring Product Manager',
    description: 'Cognitive Science student at UC Berkeley with a passion for understanding human behavior and creating meaningful product experiences.',
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