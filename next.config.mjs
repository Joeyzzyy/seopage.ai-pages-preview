/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 支持的图片格式（Next.js 自动优化为 WebP/AVIF）
    formats: ['image/avif', 'image/webp'],
    
    // 允许的图片域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    
    // 图片缓存配置
    minimumCacheTTL: 604800, // 7天（单位：秒）
    
    // 设备尺寸断点
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // 图片尺寸断点
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // 图片质量
    quality: 85,
    
    // 禁用静态图片导入优化（可选）
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
