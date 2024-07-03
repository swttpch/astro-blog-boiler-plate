import { defaultBlogRequests } from '../../lib/blog';
import { findAllPostsSortedByPublishedAt } from '../blog';

export const getStaticPathsPost = async () => {
  const allPosts = await findAllPostsSortedByPublishedAt();
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
