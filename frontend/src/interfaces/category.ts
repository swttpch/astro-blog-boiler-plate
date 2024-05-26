export default interface Category {
  id: number;
  attributes: {
    title: string;
    description: string;
    color: string;
    createdAt: string;
    updatedAt: string;
    bgColor: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: any;
  };
}
