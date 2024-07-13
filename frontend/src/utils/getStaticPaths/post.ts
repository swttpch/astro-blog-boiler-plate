import { defaultBlogRequests } from '../../lib/blog';
import { findAllPostsSortedByPublishedAt } from '../blog';

export const getStaticPathsPost = async ({ language }: { language: string }) => {
  const allPosts = await findAllPostsSortedByPublishedAt({ language });
  const { blogInfo, footerNavigation, headerNavigation } = await defaultBlogRequests();
  return allPosts.data.map((post) => ({
    params: { slug: post.attributes.slug },
    props: {
      post,
      blogInfo,
      footerNavigation,
      headerNavigation,
    },
  }));
};
