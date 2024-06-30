import { PAGE_SIZE } from '../constants/common';
import type Article from '../interfaces/article';
import type Meta from '../interfaces/meta';
import fetchApi from '../lib/strapi';

export const findArticlesAndMetaBySearch = async ({
  search,
  curPage = 1,
}: {
  search: string;
  curPage?: number;
}) => {
  return await fetchApi<{ data: Article[]; meta: Meta }>({
    endpoint: '/articles',
    query: {
      publicationState: 'live',
      sort: ['publishedAt:desc'],
      filters: {
        $or: [
          {
            title: {
              $containsi: search,
            },
          },
          {
            previewText: {
              $containsi: search,
            },
          },
        ],
      },
      populate: {
        author: {
          fields: '*',
          populate: '*',
        },
        mainImage: '*',
        categories: '*',
        tags: '*',
      },
      pagination: {
        page: curPage,
        pageSize: PAGE_SIZE,
      },
    },
  });
};

export const findSafeArticlesAndMetaBySearch = async () => {
  return await fetchApi<{ data: Article[]; meta: Meta }>({
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
        pageSize: 6,
      },
    },
  });
};
