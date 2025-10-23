'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

// 简化的三栏布局
const footerSections = [
  {
    title: "Product",
    titleUrl: "/",
    links: [
      { label: "Generate Alternative Pages", url: "/alternativepage", target: "_blank" },
      { label: "Generate Best Pages", url: "/bestpage", target: "_blank" },
      { label: "Generate Faq Pages", url: "/faqpage", target: "_blank" },
      { label: "Generate Solutions", url: "/solutionpage", target: "_blank" },
      { label: "Generate Testimonials", url: "/testimonialpage", target: "_blank" },
    ],
  },
  {
    title: "Company",
    titleUrl: "/about-us",
    links: [
      { label: "Privacy Policy", url: "/privacy-policy", target: "_blank" },
      { label: "Terms and Conditions", url: "/terms-and-conditions", target: "_blank" },
      { label: "Partners", url: "/partner", target: "_blank" },
      { label: "About Us", url: "/about-us", target: "_blank" },
      { label: "PR Release", url: "/pr/seopage-ai-press-release", target: "_blank" }
    ],
  },
  {
    title: "Resources",
    titleUrl: "/resources",
    links: [
      { label: "Free SEO Tools", url: "/tools", target: "_blank" },
      { label: "SEO Knowledge Base", url: "/advanced-technical-seo", target: "_blank" },
      { label: "Blog", url: "/blog", target: "_blank" },
      { label: "Help Center", url: "/help", target: "_blank" },
      { label: "Contact Us", url: "/contact", target: "_blank" }
    ],
  },
];

export const BlogFooter = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 三栏布局 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Link
                  href={section.titleUrl}
                  className="hover:text-blue-600 transition-colors duration-300"
                >
                  {section.title}
                </Link>
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.url}
                      target={link.target || "_self"}
                      rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部版权信息 */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
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
