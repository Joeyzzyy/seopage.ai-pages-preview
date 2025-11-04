'use client';
import React from 'react';
import { BlogHeader } from './BlogHeader';
import { BlogFooter } from './BlogFooter';
import { BlogTableOfContents } from './blog/BlogTableOfContents';
import { BlogContent } from './blog/BlogContent';
import '../../src/styles/blog-content.css';

/**
 * Blog 布局组件
 * 专门用于渲染 blog 类型的文章
 */
const BlogLayout = ({ article }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 博客专用 Header */}
      <BlogHeader />
      
      {/* 目录导航 */}
      <BlogTableOfContents htmlContent={article?.html} />

      {/* 博客内容 */}
      <BlogContent content={article?.html} article={article} />
      
      {/* 博客专用 Footer */}
      <BlogFooter />
    </div>
  );
};

export default BlogLayout;
