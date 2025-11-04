'use client';
import { useEffect, useMemo } from 'react';

/**
 * Blog 内容处理 Hook
 * 合并所有 DOM 操作，减少重渲染
 */
export function useBlogContent(content) {
  // 解析 JSON 格式的 HTML 内容
  const { parsedContent, htmlContent } = useMemo(() => {
    if (!content) return { parsedContent: null, htmlContent: '' };
    
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && parsed.content) {
        return {
          parsedContent: parsed,
          htmlContent: parsed.content
        };
      }
    } catch (e) {
      // 如果不是 JSON，直接使用原始内容
      return {
        parsedContent: null,
        htmlContent: content
      };
    }
    
    return { parsedContent: null, htmlContent: content };
  }, [content]);

  // 合并所有 DOM 操作到一个 useEffect 中
  useEffect(() => {
    if (!htmlContent) return;

    const timer = setTimeout(() => {
      const contentElement = document.querySelector('.blog-article-content');
      if (!contentElement) return;

      // 批量处理所有 DOM 操作
      const fragment = document.createDocumentFragment();
      
      // 1. 处理所有链接 - 在新标签页打开
      const links = contentElement.querySelectorAll('a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('http') || href.startsWith('https') || href.startsWith('//'))) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });

      // 2. 处理所有图片 - 添加懒加载
      const images = contentElement.querySelectorAll('img');
      images.forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
      });

      // 3. 处理所有 H2 标题 - 添加 ID 用于目录导航
      const h2Elements = contentElement.querySelectorAll('h2');
      h2Elements.forEach((h2, index) => {
        const title = h2.textContent || h2.innerText || `Section ${index + 1}`;
        if (title.toLowerCase().includes('conclusion') || 
            title.toLowerCase().includes('总结') || 
            title.toLowerCase().includes('结论')) {
          h2.id = 'conclusion';
        } else if (!h2.id) {
          h2.id = `section-${index}`;
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [htmlContent]);

  return { parsedContent, htmlContent };
}

/**
 * 提取目录结构 Hook
 */
export function useTableOfContents(htmlContent) {
  const sections = useMemo(() => {
    if (!htmlContent) return { sections: [], hasConclusion: false };

    // 在 SSR 环境中返回空数组
    if (typeof window === 'undefined') {
      return { sections: [], hasConclusion: false };
    }

    // 延迟解析，等待 DOM 渲染
    return { sections: [], hasConclusion: false };
  }, [htmlContent]);

  useEffect(() => {
    if (!htmlContent) return;

    const timer = setTimeout(() => {
      const contentElement = document.querySelector('.blog-article-content');
      if (!contentElement) return;

      const h2Elements = contentElement.querySelectorAll('h2');
      const extracted = [];
      let conclusionFound = false;

      Array.from(h2Elements).forEach((h2, index) => {
        const title = h2.textContent || h2.innerText || `Section ${index + 1}`;
        
        if (title.toLowerCase().includes('conclusion') || 
            title.toLowerCase().includes('总结') || 
            title.toLowerCase().includes('结论')) {
          conclusionFound = true;
        } else {
          extracted.push({
            h2: title,
            id: `section-${extracted.length}`
          });
        }
      });

      // 触发自定义事件通知组件更新
      window.dispatchEvent(new CustomEvent('toc-updated', { 
        detail: { sections: extracted, hasConclusion: conclusionFound } 
      }));
    }, 100);

    return () => clearTimeout(timer);
  }, [htmlContent]);

  return sections;
}

