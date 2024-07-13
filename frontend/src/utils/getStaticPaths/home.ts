import { PAGE_SIZE } from '../../constants/common';
import type Article from '../../interfaces/article';
import fetchApi from '../../lib/strapi';
import {
  extractCategories,
  extractTags,
  findAllPostsSortedByPublishedAt,
  findDefaultBlogContent,
  findMostLikedPost,
  findMostRelevantCategories,
  findPostsByCategory,
} from '../blog';

export const getStaticPathsBlogHome = async ({ language }: { language: string }) => {
  const [blogInfo, header, footer] = await findDefaultBlogContent({ language });
  const allPosts = await findAllPostsSortedByPublishedAt({ language });
  const mostRelevantCategories = await findMostRelevantCategories({ language });
  const mostRelevantCategory = mostRelevantCategories[0];
  const mostRelevantCategoryArticles = await findPostsByCategory({
    language,
    id: mostRelevantCategory?.id,
  });
  const mostLikedPosts = await findMostLikedPost({ language });
  const obj = {
    blogInfo,
    header,
    footer,
    categories: mostRelevantCategories,
    mostRelevantCategory: {
      category: mostRelevantCategory,
      articles: mostRelevantCategoryArticles,
    },
    mostLikedPosts,
  };
  if (!allPosts || allPosts.data.length === 0)
    return [
      {
        params: { page: undefined },
        props: {
          articles: [],
          mainTags: [],
          mainCategories: [],
          heroArticles: [],
          meta: {
            pagination: {
              page: 1,
              pageSize: PAGE_SIZE,
              pageCount: 1,
              total: 0,
            },
          },
          ...obj,
        },
      },
    ];

  const heroArticles = await getHeroArticles(language);
  const pages = Array.from(
    { length: Math.ceil(allPosts.meta.pagination.total / PAGE_SIZE) },
    (_, i) => i + 1,
  );
  return [
    ...pages.map((page) => ({
      params: {
        page: page.toString(),
      },
      props: {
        articles: allPosts.data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        ...obj,
        mainCategories: extractCategories(
          allPosts.data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        ),
        mainTags: extractTags(allPosts.data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)),
        meta: allPosts.meta,
        heroArticles,
      },
    })),
    {
      params: { page: undefined },
      props: {
        articles: allPosts.data.slice(0, PAGE_SIZE),
        ...obj,
        mainCategories: extractCategories(allPosts.data.slice(0, PAGE_SIZE)),
        mainTags: extractTags(allPosts.data.slice(0, PAGE_SIZE)),
        meta: allPosts.meta,
        heroArticles,
      },
    },
  ];
};

const getHeroArticles = async (lang: string): Promise<Article[]> => {
  return await fetchApi<Article[]>({
    endpoint: 'articles',
    wrappedByKey: 'data',
    query: {
      populate: {
        mainImage: {
          fields: ['url', 'alternativeText', 'width', 'height', 'formats'],
        },
        categories: {
          fields: ['title'],
        },
      },
      pagination: {
        pageSize: 3,
      },
      publicationState: 'live',
      sort: ['publishedAt:desc'],
      locale: lang,
    },
  });
};
