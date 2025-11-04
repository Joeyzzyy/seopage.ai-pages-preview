'use client';
import React, { useState } from 'react';
import Image from 'next/image';

/**
 * OptimizedImage 组件
 * 支持多格式图片（AVIF/WebP）、懒加载、骨架屏
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '100vw',
  quality = 85,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // 如果图片加载失败，显示占位符
  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <svg 
          className="w-12 h-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 骨架屏加载状态 */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      {/* Next.js Image 组件，自动优化为 WebP/AVIF */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        {...props}
      />
    </div>
  );
}

/**
 * OptimizedImageFill 组件
 * 使用 fill 布局的优化图片组件
 */
export function OptimizedImageFill({
  src,
  alt,
  priority = false,
  className = '',
  objectFit = 'cover',
  sizes = '100vw',
  quality = 85,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // 如果图片加载失败，显示占位符
  if (error) {
    return (
      <div className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}>
        <svg 
          className="w-12 h-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      {/* 骨架屏加载状态 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Next.js Image 组件，使用 fill 布局 */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ objectFit }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        {...props}
      />
    </>
  );
}

/**
 * 响应式图片组件
 * 根据屏幕尺寸自动加载合适大小的图片
 */
export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  breakpoints = {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
  },
  ...props
}) {
  // 生成响应式 sizes 属性
  const responsiveSizes = `
    (max-width: ${breakpoints.mobile}px) ${breakpoints.mobile}px,
    (max-width: ${breakpoints.tablet}px) ${breakpoints.tablet}px,
    (max-width: ${breakpoints.desktop}px) ${breakpoints.desktop}px,
    ${width}px
  `.replace(/\s+/g, ' ').trim();

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes={responsiveSizes}
      {...props}
    />
  );
}

