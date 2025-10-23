'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


export const BlogFooter = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 底部版权信息 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
              <Image
                src="/images/seopageai-logo.png"
                alt="SEOPage.ai"
                width={120}
                height={32}
                className="h-6 w-auto"
                priority
              />
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            @ 2025 SEOPage.ai All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};
