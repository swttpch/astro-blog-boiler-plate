import type { AuthorPlain } from './author';
import type Author from './author';
import type { CategoryPlain } from './category';
import type Category from './category';
import type Image from './image';
import type { Tag, TagPlain } from './tag';

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
    likes: number;
    usefullCount: number;
    uselessCount: number;
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

export interface ArticlePlain {
  id: number;
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
  likes: number;
  usefullCount: number;
  uselessCount: number;
  author: AuthorPlain;
  mainImage: Image;
  tags: Array<TagPlain>;
  categories: Array<CategoryPlain>;
  relatedArticles: Array<ArticlePlain>;
}
