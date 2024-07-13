import type Article from '../interfaces/article';
import type { BlogInfo } from '../interfaces/blog-info';
import type Category from '../interfaces/category';
import type { CategoryPlain } from '../interfaces/category';
import type Meta from '../interfaces/meta';
import type StrapiNavigation from '../interfaces/navigation';
import type { Tag } from '../interfaces/tag';
import fetchApi from '../lib/strapi';

export const findHeader = async ({ language }: { language: string }) => {
  return await fetchApi<StrapiNavigation<CategoryPlain>[]>({
    endpoint: 'navigation/render/1',
    query: {
      type: 'TREE',
      locale: language === 'pt-BR' ? 'pt-BR' : language,
    },
  });
};

export const findFooter = async ({ language }: { language: string }) => {
  return await fetchApi<StrapiNavigation<CategoryPlain>[]>({
    endpoint: 'navigation/render/2',
    query: {
      type: 'TREE',
      locale: language === 'pt-BR' ? 'pt-BR' : language,
    },
  });
};

export const findBlogInfo = async ({ language }: { language: string }) => {
  return await fetchApi<BlogInfo>({
    endpoint: 'blog-info',
    query: {
      populate: '*',
      locale: language === 'pt-BR' ? 'pt-BR' : language,
    },
  });
};

export const findDefaultBlogContent = async ({ language }: { language: string }) => {
  return await Promise.all([
    findBlogInfo({ language }),
    findHeader({ language }),
    findFooter({ language }),
  ]);
};

export const findMostRelevantCategories = async ({ language }: { language: string }) => {
  return await fetchApi<Category[]>({
    endpoint: '/categories',
    wrappedByKey: 'data',
    query: {
      sort: ['articlesCount:desc'],
      pagination: {
        page: 1,
        pageSize: 5,
      },
      locale: language === 'pt-BR' ? 'pt-BR' : language,
    },
  });
};

export const findAllPostsSortedByPublishedAt = async ({ language }: { language: string }) => {
  const data = await fetchApi<{ data: Article[]; meta: Meta }>({
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
        relatedArticles: '*',
        localizations: '*',
      },
      locale: language === 'pt-BR' ? 'pt-BR' : language,
    },
  });
  return data;
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

export const findPostsByCategory = async (options: { language: string; id: number }) => {
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
        localizations: '*',
      },
      filters: {
        categories: {
          id: {
            $eq: options.id,
          },
        },
      },
      locale: options.language === 'pt-BR' ? 'pt-BR' : options.language,
    },
  });
};

export const findMostLikedPost = async ({ language }: { language: string }) => {
  return await fetchApi<{ data: Article[]; meta: Meta }>({
    endpoint: '/articles',
    query: {
      publicationState: 'live',
      sort: ['likes:desc'],
      populate: {
        author: {
          fields: '*',
          populate: '*',
        },
        mainImage: '*',
        categories: '*',
        tags: '*',
        localizations: '*',
      },
      locale: language === 'pt-BR' ? 'pt-BR' : language,
    },
  });
};
