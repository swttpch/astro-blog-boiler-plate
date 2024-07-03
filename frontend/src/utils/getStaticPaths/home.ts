import { PAGE_SIZE } from '../../constants/common';
import {
  extractCategories,
  extractTags,
  findAllPostsSortedByPublishedAt,
  findDefaultBlogContent,
  findMostLikedPost,
  findMostRelevantCategories,
  findPostsByCategory,
} from '../blog';

export const getStaticPathsBlogHome = async () => {
  const [blogInfo, header, footer] = await findDefaultBlogContent();
  const allPosts = await findAllPostsSortedByPublishedAt();
  const mostRelevantCategories = await findMostRelevantCategories();
  const mostRelevantCategory = mostRelevantCategories[0];
  const mostRelevantCategoryArticles = await findPostsByCategory(mostRelevantCategory?.id);
  const mostLikedPosts = await findMostLikedPost();
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
      },
    },
  ];
};
