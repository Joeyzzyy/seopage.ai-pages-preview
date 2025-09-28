import axios from 'axios';

// 根据当前访问的URL判断API端点
const getApiUrl = () => {
  return 'https://api.websitelm.com/v1'; // 其他环境使用原API
};


// 创建 axios 实例的函数
const createApiClient = () => {
  return axios.create({
    baseURL: getApiUrl(),
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 获取批次历史数据
export async function getArticles(customerId, token) {
  try {
    const headers = {};
    const apiUrl = getApiUrl(); // 动态获取API URL
    
    const response = await axios.get(`${apiUrl}/pages/article/${customerId}`, {headers});
    return response.data;
  } catch (error) {
    console.error('获取批次历史数据失败:', error);
    return null;
  }
};

// 根据 slug 获取单篇文章
export async function getPageBySlug(slug, lang) {
  try {
    const apiUrl = getApiUrl(); // 动态获取API URL
    const url = `${apiUrl}/pages/view/${slug}`;
    console.log('请求 URL:', url, '参数:', { slug, lang });
    
    const response = await axios.get(url, { 
      params: { lang, slug }
    });
    console.log('response', response.data)
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { notFound: true };
    }
    // 其他错误仍然记录并抛出
    console.error('Error fetching article by slug:', error.response?.data || error.message);
    throw error;
  }
}

// 获取客户定制推荐
export async function getCustomRecommendations({ pageId, customerId, title, category, lang }) {
  try {
    const apiClient = createApiClient(); // 动态创建API客户端
    const response = await apiClient.post('/website-lm/recommend', {
      pageId,
      customerId,
      title,
      category: 'WebsiteLM',
      lang
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get custom recommendations:', error);
    return null;
  }
}
