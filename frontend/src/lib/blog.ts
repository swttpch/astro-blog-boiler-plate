import { PAGE_SIZE } from '../constants/common';
import type Article from '../interfaces/article';
import type { BlogInfo } from '../interfaces/blog-info';
import type { CategoryPlain } from '../interfaces/category';
import type Category from '../interfaces/category';
import type Meta from '../interfaces/meta';
import type StrapiNavigation from '../interfaces/navigation';
import type { Tag } from '../interfaces/tag';
import fetchApi from '../lib/strapi';

export const defaultBlogRequests = async () => {
  const [blogInfo, headerNavigation, footerNavigation] = await Promise.all([
    fetchApi<BlogInfo>({
      endpoint: 'blog-info',
      query: {
        populate: '*',
      },
    }),
    fetchApi<StrapiNavigation<CategoryPlain>[]>({
      endpoint: 'navigation/render/1',
      query: {
        type: 'TREE',
      },
    }),
    fetchApi<StrapiNavigation<CategoryPlain>[]>({
      endpoint: 'navigation/render/2',
      query: {
        type: 'TREE',
      },
    }),
  ]);

  return {
    blogInfo,
    headerNavigation,
    footerNavigation,
  };
};

export const defaultBlogRequestsWithCategoriesAndTags = async () => {
  const [categories, tags] = await Promise.all([
    fetchApi<Category[]>({
      endpoint: 'categories',
      wrappedByKey: 'data',
      query: {
        sort: ['title:asc'],
        pagination: {
          page: 1,
          pageSize: 5,
        },
      },
    }),
    fetchApi<Tag[]>({
      endpoint: 'tags',
      wrappedByKey: 'data',
      query: {
        sort: ['name:asc'],
      },
    }),
  ]);

  await Promise.all(
    categories.map((cat) => {
      fetchApi<Meta>({
        endpoint: '/articles',
        wrappedByKey: 'meta',
        query: {
          publicationState: 'live',
          filters: {
            categories: {
              id: {
                $eq: cat.id,
              },
            },
          },
          pagination: {
            page: 1,
            pageSize: 1,
          },
        },
      }).then((res) => {
        // console.count('set');
        Object.assign(cat, {
          id: cat.id,
          attributes: { ...cat.attributes, qtd: res.pagination.total },
        });
      });
    }),
  );
  return { categories, tags };
};

export const homePageBlogRequests = async ({ currentPage }: { currentPage: number }) => {
  const [articlesResponse] = await Promise.all([
    fetchApi<{ data: Article[]; meta: Meta }>({
      endpoint: '/articles',
      query: {
        publicationState: 'live',
        sort: ['publishedAt:desc'],
        populate: {
          author: {
            fields: '*',
            populate: '*',
          },
          mainImage: '*',
          categories: '*',
        },
        pagination: {
          page: currentPage,
          pageSize: PAGE_SIZE,
        },
      },
    }),
  ]);

  return {
    articleResponse: articlesResponse,
  };
};
