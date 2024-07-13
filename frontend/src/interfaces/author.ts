import type Image from './image';
import type { Seo } from './seo';
import type { Socials } from './socials';

export default interface Author {
  id: number;
  attributes: {
    name: string;
    jobTitle: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    expertise: Array<{
      id: number;
      text: string;
    }>;
    avatar?: { data: Image };
    seo?: Seo;
    socials: Array<Socials>;
  };
}

export interface AuthorPlain {
  id: number;
  name: string;
  jobTitle: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  expertise: Array<{
    id: number;
    text: string;
  }>;
  avatar?: Image;
  socials: Array<Socials>;
  seo: Seo;
}
