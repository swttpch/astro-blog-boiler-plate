import type { ArticlePlain } from './article';
import type { AuthorPlain } from './author';
import type { CategoryPlain } from './category';
import type { TagPlain } from './tag';

export default interface StrapiNavigation<
  T extends ArticlePlain | CategoryPlain | AuthorPlain | TagPlain,
> {
  order: number;
  id: number;
  title: string;
  type: string;
  path: string;
  externalPath?: string;
  uiRouterKey: string;
  menuAttached: boolean;
  collapsed: boolean;
  createdAt: string;
  updatedAt: string;
  audience?: Array<object>;
  parent?: object;
  external: boolean;
  related: T & {
    __contentType: string;
    navigationItemId: number;
  };
  items?: StrapiNavigation<T>[];
}
