import type Author from './author';
import type Category from './category';
import type Image from './image';

export default interface Article {
  id: number;
  attributes: {
    title: string;
    url: string;
    content: string;
    isTrending: boolean;
    isTopPick: boolean;
    readingTime: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    previewText: string;
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: any;
    mainImage: {
      data: Image;
    };
    author: {
      data: Author;
    };
    relatedArticles: {
      data: Array<Article>;
    };
    category: {
      data: Array<Category>;
    };
  };
}
