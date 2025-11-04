'use client';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { useBlogContent } from '../../hooks/useBlogContent';

/**
 * Blog 内容渲染组件
 * 专门处理 blog 类型的文章内容
 */
export function BlogContent({ content, article }) {
  const { parsedContent, htmlContent } = useBlogContent(content);

  // 生成博客结构化数据
  const blogStructuredData = useMemo(() => {
    const title = parsedContent?.title || article?.title || 'Untitled';
    const description = parsedContent?.description || article?.description || '';
    const author = parsedContent?.author || article?.author || 'SeoPage.ai Team';
    const publishDate = article?.created_at || new Date().toISOString();
    const modifiedDate = article?.updated_at || publishDate;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `https://seopage.ai/blog/${article?.id || 'unknown'}`,
      "headline": title,
      "description": description,
      "image": parsedContent?.heroImage ? {
        "@type": "ImageObject",
        "url": parsedContent.heroImage,
        "width": 1200,
        "height": 630
      } : undefined,
      "author": {
        "@type": "Person",
        "name": author,
        "url": "https://seopage.ai"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SeoPage.ai",
        "logo": {
          "@type": "ImageObject",
          "url": "https://seopage.ai/images/competitors-logo-homescreen/seopageai-logo.png",
          "width": 300,
          "height": 60
        },
        "url": "https://seopage.ai"
      },
      "datePublished": publishDate,
      "dateModified": modifiedDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://seopage.ai/blog/${article?.id || 'unknown'}`
      },
      "articleSection": "Blog",
      "keywords": parsedContent?.keywords || "SEO, Blog, Marketing, Digital Marketing",
      "wordCount": htmlContent ? htmlContent.split(' ').length : 0
    };
  }, [parsedContent, article, htmlContent]);

  return (
    <>
      {/* 添加博客结构化数据脚本 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData, null, 0)
        }}
      />

      <main className="w-[70%] max-w-none mx-auto px-4 py-4 flex-grow pt-20">
        {/* 文章元信息 */}
        <div className="mb-4 flex items-center text-sm text-gray-600">
          {parsedContent?.cluster && (
            <>
              <span className="text-blue-600 font-medium">{parsedContent.cluster}</span>
              <span className="mx-2">•</span>
            </>
          )}
          <time dateTime={article?.created_at} className="text-gray-500">
            {article?.created_at ? new Date(article.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : ''}
          </time>
          {article?.updated_at && article?.updated_at !== article?.created_at && (
            <>
              <span className="mx-2">•</span>
              <span className="text-gray-500">
                Updated: {new Date(article.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </>
          )}
          {parsedContent?.author && (
            <>
              <span className="mx-2">•</span>
              <span className="text-gray-500">By {parsedContent.author}</span>
            </>
          )}
        </div>
        
        {/* 文章标题 */}
        <h1 className="text-4xl font-bold mb-3 text-gray-900 leading-tight">
          {parsedContent?.title || article?.title || 'Untitled'}
        </h1>
        
        {/* Hero 图片 */}
        {parsedContent?.heroImage && (
          <div className="relative w-2/3 mx-auto aspect-video mb-8">
            <Image
              src={parsedContent.heroImage}
              alt={parsedContent.title || 'Hero image'}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
        )}

        {/* 文章内容 */}
        <div className="mb-8">
          {htmlContent ? (
            <div 
              className="w-full blog-content-links blog-article-content" 
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              onClick={(e) => {
                // 处理链接点击事件
                if (e.target.tagName === 'A') {
                  const href = e.target.getAttribute('href');
                  if (href && (href.startsWith('http') || href.startsWith('https') || href.startsWith('//'))) {
                    e.target.setAttribute('target', '_blank');
                    e.target.setAttribute('rel', 'noopener noreferrer');
                  }
                }
                // 防止代码块内的点击事件冒泡
                if (e.target.tagName === 'CODE' || e.target.tagName === 'PRE' || e.target.closest('code') || e.target.closest('pre')) {
                  e.stopPropagation();
                }
              }}
            />
          ) : (
            <div className="bg-red-100 p-4 mb-6 text-sm rounded-lg">
              ❌ No HTML content available
            </div>
          )}
        </div>
        
        {/* CTA 部分 */}
        <div className="border-t border-gray-200 pt-8 pb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Transform Your SEO Strategy?</h3>
            <p className="text-lg text-gray-600 mb-6">Discover how SEOPage.ai can help you create high-converting pages that drive organic traffic and boost your search rankings.</p>
            <a 
              href="https://seopage.ai" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Started with SEOPage.ai
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

