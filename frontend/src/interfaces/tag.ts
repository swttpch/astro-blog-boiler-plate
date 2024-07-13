import type { ArticlePlain } from './article';
import type Article from './article';
import type { Seo } from './seo';

export interface Tag {
  id: number;
  attributes: {
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    seo?: Seo;
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
  seo?: Seo;
  highlights: Array<ArticlePlain>;
}
