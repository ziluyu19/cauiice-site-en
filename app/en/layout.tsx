import React from 'react';
import type { Metadata } from 'next';
import EnglishHeader from '@/components/en/EnglishHeader';
import EnglishFooter from '@/components/en/EnglishFooter';
import BackToTop from '@/components/en/BackToTop';

export const metadata: Metadata = {
  title: 'CAUIICE - International Cooperation & Exchange Committee',
  description: 'Official International Portal of the International Cooperation and Exchange Committee of the Chinese Association of University-run Industries (CAUIICE).',
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A] antialiased">
      <EnglishHeader />
      <main className="flex-1">
        {children}
      </main>
      <EnglishFooter />
      <BackToTop />
    </div>
  );
}
