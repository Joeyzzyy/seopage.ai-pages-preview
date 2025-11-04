'use client';
import React, { useState, useEffect } from 'react';

/**
 * Blog 目录组件
 * 提供文章导航功能
 */
export function BlogTableOfContents({ htmlContent }) {
  const [isVisible, setIsVisible] = useState(true);
  const [extractedSections, setExtractedSections] = useState([]);
  const [hasConclusion, setHasConclusion] = useState(false);

  useEffect(() => {
    if (!htmlContent) return;

    const timer = setTimeout(() => {
      const contentElement = document.querySelector('.blog-article-content');
      
      if (contentElement) {
        const h2Elements = contentElement.querySelectorAll('h2');
        const extracted = [];
        let conclusionFound = false;
        
        Array.from(h2Elements).forEach((h2, index) => {
          const title = h2.textContent || h2.innerText || `Section ${index + 1}`;
          
          if (title.toLowerCase().includes('conclusion') || 
              title.toLowerCase().includes('总结') || 
              title.toLowerCase().includes('结论')) {
            conclusionFound = true;
            h2.id = 'conclusion';
          } else {
            h2.id = `section-${extracted.length}`;
            extracted.push({
              h2: title,
              id: `section-${extracted.length}`
            });
          }
        });
        
        setExtractedSections(extracted);
        setHasConclusion(conclusionFound);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [htmlContent]);

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToConclusion = () => {
    const element = document.getElementById('conclusion');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!extractedSections || extractedSections.length === 0) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-32 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Table of Contents"
        aria-label="Toggle Table of Contents"
      >
        <svg 
          className={`w-5 h-5 transition-transform ${isVisible ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* TOC Panel */}
      <div 
        className={`fixed top-44 right-4 z-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`} 
        style={{ maxWidth: '280px', maxHeight: '60vh' }}
      >
        <div className="p-4">
          <div className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">
            Table of Contents
          </div>
          <div className="space-y-1 overflow-y-auto" style={{ maxHeight: '50vh' }}>
            {extractedSections.map((section, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className="w-full text-left text-sm px-3 py-2 rounded hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600"
              >
                <span className="block truncate">{section.h2}</span>
              </button>
            ))}
            {hasConclusion && (
              <button
                onClick={scrollToConclusion}
                className="w-full text-left text-sm px-3 py-2 rounded hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600"
              >
                <span className="block truncate">Conclusion</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

