export interface Tag {
  id: number;
  attributes: {
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    seo?: object;
  };
}
