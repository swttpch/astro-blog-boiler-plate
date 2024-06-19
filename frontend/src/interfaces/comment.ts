export type Comment = {
  id: number;
  content: string;
  blocked?: boolean;
  blockedThread: boolean;
  blockReason?: string;
  isAdminComment?: boolean;
  removed?: boolean;
  approvalStatus: string;
  createdAt: string;
  updatedAt: string;
  gotThread: boolean;
  threadFirstItemId: number;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  children: Array<Comment>;
};
