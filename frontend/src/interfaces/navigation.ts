import type Article from './article';
import type Author from './author';
import type Category from './category';
import type { Tag } from './tag';

export default interface StrapiNavigation<T extends Article | Category | Author | Tag> {
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
  related: T['attributes'] & {
    id: number;
    __contentType: string;
    navigationItemId: number;
  };
  items?: object;
}
