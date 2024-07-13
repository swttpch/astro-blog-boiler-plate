import { findDefaultBlogContent, findMostRelevantCategories } from '../blog';

export const getStaticPathFourOhFour = async ({ language }: { language: string }) => {
  const [blogInfo, header, footer] = await findDefaultBlogContent({ language });
  const mostRelevantCategories = await findMostRelevantCategories({ language });
  return {
    blogInfo,
    header,
    footer,
    categories: mostRelevantCategories,
  };
};
