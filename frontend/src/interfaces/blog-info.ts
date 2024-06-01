import type Image from './image';
import type { Socials } from './socials';

export type BlogInfo = {
  data: {
    id: number;
    attributes: {
      name: string;
      summary: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      brand: {
        data: Image;
      };
      socials: Array<Socials>;
    };
  };
  meta: object;
};
