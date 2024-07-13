import rss from '@astrojs/rss';
import { findAllPostsSortedByPublishedAt, findBlogInfo } from '../utils/blog';

export async function GET(context) {
  const blogInfo = await findBlogInfo({ language: 'pt-BR' });
  const articles = await findAllPostsSortedByPublishedAt({ language: 'pt-BR' });
  return rss({
    title: blogInfo.data.attributes.name,
    description: blogInfo.data.attributes.description,
    site: context.site,
    items: articles.data.map((post) => ({
      ...post,
      link: `/p/${post.attributes.slug}/`,
    })),
  });
}
