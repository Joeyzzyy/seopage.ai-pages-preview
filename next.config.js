const path = require('path');

/** @type {import('next').NextConfig} */

const nextConfig = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
        // 下面的配置是禁止搜索引擎索引
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow',
        },
      ],
    },
  ],
  transpilePackages: ['@ant-design/icons', 'antd'],
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  serverExternalPackages: ['jsdom'],
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            antd: {
              name: 'antd',
              test: /[\\/]node_modules[\\/]antd[\\/]/,
              priority: 10,
            },
          },
        },
      };
    }
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        dns: false,
        fs: false,
        child_process: false
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      'html-react-parser': path.resolve('./node_modules/html-react-parser')
    };
    return config;
  },
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'websitelm-us-east-2.s3.us-west-2.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'websitelm.com'
      },
      {
        protocol: 'https',
        hostname: '*',
      }
    ],
    domains: ['websitelm-us-east-2.s3.us-west-2.amazonaws.com'],
  },
  // 添加域名配置
  async rewrites() {
    return {
      beforeFiles: [
        
      ]
    }
  }
};

module.exports = nextConfig;