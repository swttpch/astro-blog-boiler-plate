import { findDefaultBlogContent } from '../blog';

export const getStaticPathsPrivacy = async ({ language }: { language: string }) => {
  const [blogInfo, header, footer] = await findDefaultBlogContent({ language });
  return {
    blogInfo,
    header,
    footer,
  };
};
