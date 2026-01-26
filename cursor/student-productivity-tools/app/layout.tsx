import type { Metadata } from 'next'
import './globals.css'
import { AnimationProvider } from './components/AnimationProvider'

export const metadata: Metadata = {
  title: 'Student Productivity Tools - Time Management & Focus Solutions',
  description: 'Comprehensive web-based solutions for college students to overcome procrastination and improve time management. Features Pomodoro timers, SMART goals, Eisenhower Matrix, and more.',
  keywords: ['productivity', 'time management', 'students', 'college', 'focus', 'procrastination', 'study tools'],
  authors: [{ name: 'Mohammad Alhait' }],
  creator: 'Mohammad Alhait',
  openGraph: {
    title: 'Student Productivity Tools - Time Management & Focus Solutions',
    description: 'Comprehensive web-based solutions for college students to overcome procrastination and improve time management.',
    url: 'https://student-productivity-tools.vercel.app',
    siteName: 'Student Productivity Tools',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Student Productivity Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student Productivity Tools - Time Management & Focus Solutions',
    description: 'Comprehensive web-based solutions for college students to overcome procrastination and improve time management.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Productivity Tools" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <AnimationProvider>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </AnimationProvider>
      </body>
    </html>
  )
}
