import type Article from './article';

export default interface Category {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
    color: string;
    createdAt: string;
    updatedAt: string;
    seo?: object;
    qtd?: number;
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
