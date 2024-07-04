import { z, defineCollection } from 'astro:content';

const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    updatedAt: z.string(),
  }),
});

export const collections = {
  legal: legalCollection,
};
