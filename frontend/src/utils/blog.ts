import { PAGE_SIZE } from '../constants/common';
import type Article from '../interfaces/article';
import type { BlogInfo } from '../interfaces/blog-info';
import type Category from '../interfaces/category';
import type { CategoryPlain } from '../interfaces/category';
import type Meta from '../interfaces/meta';
import type StrapiNavigation from '../interfaces/navigation';
import type { Tag } from '../interfaces/tag';
import fetchApi from '../lib/strapi';

const findHeader = async () => {
  return await fetchApi<StrapiNavigation<CategoryPlain>[]>({
    endpoint: 'navigation/render/1',
    query: {
      type: 'TREE',
    },
  });
};

const findFooter = async () => {
  return await fetchApi<StrapiNavigation<CategoryPlain>[]>({
    endpoint: 'navigation/render/2',
    query: {
      type: 'TREE',
    },
  });
};

const findBlogInfo = async () => {
  return await fetchApi<BlogInfo>({
    endpoint: 'blog-info',
    query: {
      populate: '*',
    },
  });
};

export const findDefaultBlogContent = async () => {
  return await Promise.all([findBlogInfo(), findHeader(), findFooter()]);
};

export const findMostRelevantCategories = async () => {
  return await fetchApi<Category[]>({
    endpoint: '/categories',
    wrappedByKey: 'data',
    query: {
      sort: ['articlesCount:desc'],
      pagination: {
        page: 1,
        pageSize: 5,
      },
    },
  });
};

export const findAllPostsSortedByPublishedAt = async () => {
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
        tags: '*',
      },
    },
  });
  return;
};

export const extractCategories = (articles: Article[]): Category[] => {
  const categories = articles.reduce((acc, article) => {
    article.attributes.categories?.data?.forEach((category) => {
      if (!acc.some((c) => c.id === category.id)) {
        acc.push(category);
      }
    });
    return acc;
  }, [] as Category[]);
  return categories;
};

export const extractTags = (articles: Article[]): Tag[] => {
  const tags = articles.reduce((acc, article) => {
    article.attributes.tags?.data?.forEach((tag) => {
      if (!acc.some((t) => t.id === tag.id)) {
        acc.push(tag);
      }
    });
    return acc;
  }, [] as Tag[]);
  return tags;
};

export const findPostsByCategory = async (id: number) => {
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
        tags: '*',
      },
      filters: {
        categories: {
          id: {
            $eq: id,
          },
        },
      },
    },
  });
};
