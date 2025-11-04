import { getPageBySlug, getArticles } from '../../../lib/api/index';
import { notFound } from 'next/navigation';
import CommonLayout from '../../../components/layouts/layout';
import BlogLayout from '../../../components/BlogRenderer';
import Script from 'next/script'

export const dynamic = 'auto'

export const dynamicParams = true

export const revalidate = 3600; // ISR: 重新验证周期 1 小时 

export default async function ArticlePage({ params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { lang, pageid } = resolvedParams;
    console.log('resolvedParams', resolvedParams)
    
    const articleData = await getPageBySlug(pageid, lang);

    if (!articleData?.data) {
      return notFound();
    }
    
    const article = articleData.data;
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      datePublished: article.updatedAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: article.publisher,
        logo: {
          '@type': 'ImageObject',
          url: article.publisherLogo
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
      }
    };

    if (typeof window !== 'undefined') {
      window.__NEXT_DATA__ = window.__NEXT_DATA__ || {};
      window.__NEXT_DATA__.pageProps = { 
        ...window.__NEXT_DATA__.pageProps,
        article: JSON.parse(JSON.stringify(article)) // 深度克隆避免引用差异
      };
    }

    // 检测是否为博客类型
    const isBlogType = article?.pageType === 'blog' || 
                      article?.category === 'blog' || 
                      (article?.html && typeof article.html === 'string' && article.html.includes('"pageType":"blog"')) ||
                      (article?.html && typeof article.html === 'string' && article.html.includes('"content":'));
    return (
      <>
        <Script id="article-schema" type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </Script>
          <main className="flex-grow">
            {isBlogType ? (
              <BlogLayout article={article} />
            ) : (
              <CommonLayout article={article} />
            )}
          </main>
      </>
    );
  } catch (error) {
    throw error;
  }
}

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { lang = 'en', pageid } = resolvedParams;
    
    const articleData = await getPageBySlug(pageid, lang);
    
    if (!articleData?.data) {
      return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.'
      };
    }

    const article = articleData.data;
    console.log('article.html:', article.html);

    let description = '';
    let keywords = '';
    if (article.html && typeof article.html === 'string') {
      // 兼容属性顺序的正则
      const descMatch = article.html.match(
        /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>|<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i
      );
      description = descMatch ? (descMatch[1] || descMatch[2]) : '';
      const keywordsMatch = article.html.match(
        /<meta\s+[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["'][^>]*>|<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']keywords["'][^>]*>/i
      );
      keywords = keywordsMatch ? (keywordsMatch[1] || keywordsMatch[2]) : '';
      console.log('正则提取到的 description:', description);
      console.log('正则提取到的 keywords:', keywords);
    }

    return {
      title: article.title, 
      description: description || article.description,
      keywords: "AI SEO, competitor traffic, alternative pages, SEO automation, high-intent traffic, AltPage.ai, marketing, comparison pages",
      robots: 'index, follow',
      openGraph: { 
        title: article.title,
        description: description || article.description,
        type: 'article',
        publishedTime: article.updatedAt,
        modifiedTime: article.updatedAt,  
        locale: lang,
        siteName: '',
        images: [{
          url: '',
          width: 1200,
          height: 630,
          alt: article.title
        }]
      },
      twitter: { 
        card: 'summary_large_image',
        title: article.title,
        description: description || article.description,
        images: article.coverImage,
        creator: ''
      },
      alternates: {
        canonical: `https://your-domain.com/${lang}/${pageid}`,
        languages: {
          'en': `https://your-domain.com/en/${pageid}`,
          'zh': `https://your-domain.com/zh/${pageid}`,
        }
      },
      metadataBase: new URL(`https://your-domain.com`),
      authors: [{ name: article.author }],
      category: article.category
    };
  } catch (error) {
    return {
      title: 'Error',
      description: 'An error occurred while generating metadata.'
    };
  }
}

export async function generateStaticParams() {
  try {
    const response = await getArticles(process.env.CUSTOMER_ID, process.env.TOKEN);
    
    console.log('generateStaticParams response:', response);
    
    if (!response?.data) {
      console.log('No data in response');
      return [];
    }

    const validArticles = response.data.filter(article => 
      article && 
      typeof article.lang === 'string' && 
      typeof article.id === 'string'
    );

    console.log('Valid articles:', validArticles);
    
    const params = validArticles.map((article) => ({
      lang: article.lang,
      pageid: article.id
    }));

    console.log('Generated params:', params);
    return params;
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return []; 
  }
}
