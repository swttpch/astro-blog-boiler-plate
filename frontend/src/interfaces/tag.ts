import type { ArticlePlain } from './article';
import type Article from './article';

export interface Tag {
  id: number;
  attributes: {
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    seo?: object;
    highlights: {
      data?: Array<Article>;
    };
  };
}

export interface TagPlain {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  seo?: object;
  highlights: Array<ArticlePlain>;
}
