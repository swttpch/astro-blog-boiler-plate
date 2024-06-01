import type Author from './author';
import type Category from './category';
import type Image from './image';
import type { Tag } from './tag';

export default interface Article {
  id: number;
  attributes: {
    title: string;
    isTrending: boolean;
    isTopPick: boolean;
    readingTime: string;
    previewText: string;
    isCategoryHighlight: boolean;
    content: string;
    isTagHighlight: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    slug: string;
    author: {
      data?: Author;
    };
    mainImage: {
      data?: Image;
    };
    tags: {
      data?: Array<Tag>;
    };
    categories: {
      data?: Array<Category>;
    };
    relatedArticles: {
      data?: Array<Article>;
    };
    seo?: object;
  };
}
