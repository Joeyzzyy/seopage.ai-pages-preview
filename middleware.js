import { NextResponse } from 'next/server';

// 配置允许的客户域名映射
const customDomains = {
  'websitelm.com': {
    lang: 'en',
    pathMapping: {
      '/': 'home',
      '/features': 'features',
      // 添加更多路径映射
    }
  },
  // 添加 localhost 支持
  'localhost:3000': {
    lang: 'en',
    pathMapping: {
      '/': 'home',
      '/features': 'features',
    }
  },
  
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const DOMAIN = process.env.DOMAIN || '';

  // 处理自定义域名和本地开发环境
  const customDomain = customDomains[hostname];
  if (customDomain || (isDevelopment && hostname === 'localhost:3000')) {
    const url = request.nextUrl.clone();
    const domainConfig = customDomain || customDomains['localhost:3000'];
    
    // 如果是根路径或配置的路径，重写到对应的 slug
    const mappedSlug = pathname === '/' ? domainConfig.pathMapping['/'] : domainConfig.pathMapping[pathname];
    if (mappedSlug) {
      url.pathname = `/${domainConfig.lang}/${mappedSlug}`;
      return NextResponse.rewrite(url);
    }
  }

  // 原有的子域名逻辑
  const pathRegex = /^\/[a-z]{2}\/[\w-]+$/;
  if (!pathRegex.test(pathname)) {
    return NextResponse.next();
  }

  if (!isDevelopment) {
    const isSubdomain = hostname.startsWith(`pages.${DOMAIN}`);
    if (!isSubdomain) {
      return NextResponse.next();
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  
  const response = NextResponse.rewrite(url);
  response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
  
  return response;
}

export const config = {
  matcher: [
    '/',
    '/:path*',
    // 排除特定路径
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};