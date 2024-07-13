import type { ArticlePlain } from './article';
import type Article from './article';
import type { Seo } from './seo';

export default interface Category {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
    color: string;
    createdAt: string;
    updatedAt: string;
    seo?: Seo;
    articlesCount: number;
    highlights: {
      data?: Array<Article>;
    };
    subCategories: {
      data?: Array<Category>;
    };
    parentCategory: {
      data?: Category;
    };
  };
}

export interface CategoryPlain {
  id: number;
  title: string;
  description: string;
  slug: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  qtd?: number;
  highlights: Array<ArticlePlain>;
  subCategories: Array<CategoryPlain>;
  parentCategory: CategoryPlain;
  seo: Seo;
}
