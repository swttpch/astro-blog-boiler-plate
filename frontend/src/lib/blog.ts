import type { BlogInfo } from '../interfaces/blog-info';
import type Category from '../interfaces/category';
import type StrapiNavigation from '../interfaces/navigation';
import fetchApi from '../lib/strapi';

export const defaultBlogRequests = async () => {
  const [blogInfo, headerNavigation] = await Promise.all([
    fetchApi<BlogInfo>({
      endpoint: 'blog-info',
      query: {
        populate: '*',
      },
    }),
    fetchApi<StrapiNavigation<Category>[]>({
      endpoint: 'navigation/render/1',
    }),
  ]);

  return {
    blogInfo,
    headerNavigation,
  };
};
