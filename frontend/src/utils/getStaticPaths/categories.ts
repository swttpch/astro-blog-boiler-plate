import { PAGE_SIZE } from '../../constants/common';
import type Article from '../../interfaces/article';
import type Category from '../../interfaces/category';
import type Meta from '../../interfaces/meta';
import fetchApi from '../../lib/strapi';
import { findDefaultBlogContent } from '../blog';

export const getStaticPathsCategoriesSlug = async ({ language }: { language: string }) => {
  const [blogInfo, header, footer] = await findDefaultBlogContent({ language });
  const categories = await fetchApi<Category[]>({
    endpoint: 'categories',
    wrappedByKey: 'data',
    query: {
      populate: {
        highlights: {
          populate: '*',
        },
      },
      locale: language === 'pt-BR' ? 'pt-BR' : language,
    },
  });

  const articlesResponse = await Promise.all(
    categories.map(({ id }) =>
      fetchApi<{ data: Article[]; meta: Meta }>({
        endpoint: '/articles',
        query: {
          publicationState: 'live',
          sort: ['publishedAt:desc'],
          filters: {
            categories: {
              id: {
                $eq: id,
              },
            },
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

          locale: language === 'pt-BR' ? 'pt-BR' : language,
        },
      }),
    ),
  );

  const res = categories.map((category, index) => {
    const pages = Array.from(
      { length: Math.ceil(articlesResponse[index].meta.pagination.total / PAGE_SIZE) },
      (_, i) => i + 1,
    );
    return [
      {
        params: {
          slug: category.attributes.slug,
          page: undefined,
        },
        props: {
          blogInfo,
          header,
          footer,
          category,
          articles: articlesResponse[index].data.slice(0, PAGE_SIZE),
          meta: {
            pagination: {
              page: 1,
              pageSize: PAGE_SIZE,
              pageCount: pages.length,
              total: articlesResponse[index].meta.pagination.total,
            },
          },
        },
      },
      ...pages.map((page) => ({
        params: {
          slug: category.attributes.slug,
          page: page.toString(),
        },
        props: {
          blogInfo,
          header,
          footer,
          category,
          articles: articlesResponse[index].data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
          meta: {
            pagination: {
              page: page,
              pageSize: PAGE_SIZE,
              pageCount: pages.length,
              total: articlesResponse[index].meta.pagination.total,
            },
          },
        },
      })),
    ];
  });

  return res.flat();
};
