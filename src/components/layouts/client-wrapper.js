'use client';

import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./header-template'), {
  ssr: false
});

const Footer = dynamic(() => import('./footer-template'), {
  ssr: false
});

export function ClientWrapper({ children, article }) {
  const isHtmlContent = article?.html?.trim().startsWith('<!DOCTYPE html>') || 
                       article?.html?.trim().startsWith('<html');

  return (
    <div className="flex flex-col min-h-screen">
      {!isHtmlContent && <Header theme="light" />}
      {children}
      {!isHtmlContent && <Footer />}
    </div>
  );
}
