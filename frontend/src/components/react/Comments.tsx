import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';
import type { Comment } from '../../interfaces/comment';
import { useEffect, useRef, useState } from 'react';
import AvatarPhoto from './AvatarPhoto';
import 'react-simple-toasts/dist/theme/success.css';
import toast from 'react-simple-toasts';

const queryClient = new QueryClient();
const url = import.meta.env.PUBLIC_BASE_API_URL;

type CommentsProps = {
  id: number;
};

function Comments(props: CommentsProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    </>
  );
}

function Component({ id }: CommentsProps) {
  const ref = useRef<HTMLFormElement | null>(null);
  const { data, isLoading, error, refetch } = useQuery({
    queryFn: async () => {
      const response = await fetch(
        `${url}/api/comments/api::article.article:${id}?filters[approvalStatus][$eq]=APPROVED`,
      );
      return response.json() as Promise<Comment[]>;
    },
    queryKey: ['comments', id],
  });

  const { mutate: postComment, isPending } = useMutation({
    mutationFn: async (comment: {
      name: string;
      email: string;
      content: string;
      idComment?: number;
    }) => {
      const body = JSON.stringify({
        author: {
          id: uuid(),
          name: comment.name,
          email: comment.email,
        },
        content: comment.content,
        ...((comment.idComment && { threadOf: comment.idComment }) || {}),
      });
      const response = await fetch(`${url}/api/comments/api::article.article:${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      await refetch();
      ref.current?.reset();
      toast('Comentario enviado para moderação', { theme: 'success', duration: 5000 });
      return response.json();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="flex pt-28 flex-col items-start gap-16 self-stretch flex-1">
      <form
        ref={ref}
        onSubmit={(e: any) => {
          e.preventDefault();
          postComment({
            name: e.currentTarget.name.value,
            email: e.currentTarget.email.value,
            content: e.currentTarget.content.value,
          });
        }}
        className="flex flex-col self-stretch items-start gap-16 flex-1 overflow-visible"
      >
        <textarea
          name="content"
          placeholder="content"
          className="self-stretch flex-1 px-12 py-8 rounded-sm border border-border-soft bg-white w-full"
        />
        <div className="flex gap-16 lg:gap-24 flex-col lg:flex-row items-start self-stretch flex-1">
          <input
            type="text"
            name="name"
            placeholder="name"
            className="flex-1 px-16 py-8 rounded-sm border border-border-soft bg-white self-stretch"
          />

          <input
            type="email"
            name="email"
            placeholder="email"
            className="flex-1 px-16 py-8 rounded-sm border border-border-soft bg-white self-stretch"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || isPending}
          className="self-stretch px-24 py-10 justify-center gap-8 items-center rounded-xs bg-primary-base hover:bg-primary-dark transition-colors duration-300 ease-in-out flex"
        >
          <span className="text-white text-lg font-semibold">Comentar</span>
        </button>
      </form>
      <p className="text-md font-medium text-gray-800">{data?.length} comentários</p>
      <ul className="flex-1 self-stretch flex flex-col gap-16">
        {data?.map((comment) => (
          <CommentContent key={comment.id} comment={comment} refetch={refetch} id={id} />
        ))}
      </ul>
    </div>
  );
}

const CommentContent = ({
  comment,
  refetch,
  id,
}: {
  comment: Comment;
  refetch: () => void;
  id: number;
}) => {
  const formElement = useRef<HTMLFormElement | undefined>();
  const collapseElement = useRef<HTMLDivElement | undefined>();
  const { mutate: postComment, isPending } = useMutation({
    mutationFn: async (comment: {
      name: string;
      email: string;
      content: string;
      idComment: number;
    }) => {
      const body = JSON.stringify({
        author: {
          id: uuid(),
          name: comment.name,
          email: comment.email,
        },
        content: comment.content,
        threadOf: comment.idComment,
      });
      const response = await fetch(`${url}/api/comments/api::article.article:${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      await refetch();
      setIsOpen(false);
      toast('Comentario enviado para moderação', { theme: 'success', duration: 5000 });
      formElement.current?.reset();
      return response.json();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      collapseElement.current?.style.setProperty(
        'height',
        formElement.current?.clientHeight + 'px',
      );
    } else {
      collapseElement.current?.style.setProperty('height', '0');
    }
  }, [isOpen]);
  return (
    <li
      key={comment.id}
      className="flex p-20 flex-col items-end gap-20 self-stretch rounded-sm border border-gray-200 bg-white flex-1"
    >
      <div className="flex items-center gap-16 self-stretch">
        <AvatarPhoto name={comment.author.name} className={'size-32'} />
        <div className="flex flex-col">
          <div className="flex gap-8 items-center">
            <p className="text-sm font-medium color-gray-800">{comment.author.name}</p>
            {comment.isAdminComment && (
              <span className="px-6 rounded-xs bg-primary-lighter text-xs text-primary-darker">
                Moderador
              </span>
            )}
          </div>
          <time
            className="text-xs text-gray-600"
            dateTime={new Date(comment.createdAt).toISOString()}
          >
            {new Date(comment.createdAt).toLocaleDateString('pt-br', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        </div>
      </div>
      <p className="pl-48 flex-1 text-sm text-gray-600 self-stretch">{comment.content}</p>
      <div className="pl-48 flex self-stretch">
        <button
          onClick={() => setIsOpen((old) => !old)}
          className="justify-center items-center gap-4 flex text-gray-600 hover:text-primary-base transition-colors duration-300 ease-in-out text-xs font-semibold "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M4.6215 9.50004H10.5V10.5H1.5V8.37854L6.45 3.42854L8.571 5.55054L4.621 9.50004H4.6215ZM7.1565 2.72204L8.2175 1.66104C8.31126 1.56731 8.43842 1.51465 8.571 1.51465C8.70358 1.51465 8.83074 1.56731 8.9245 1.66104L10.339 3.07554C10.4327 3.16931 10.4854 3.29646 10.4854 3.42904C10.4854 3.56162 10.4327 3.68878 10.339 3.78254L9.278 4.84304L7.157 2.72204H7.1565Z"
              fill="currentColor"
            />
          </svg>
          <span>responder</span>
        </button>
      </div>
      <div
        className="self-stretch overflow-hidden transition-all duration-300"
        // @ts-ignore
        ref={collapseElement}
      >
        <form
          // @ts-ignore
          ref={formElement}
          onSubmit={(e: any) => {
            e.preventDefault();
            postComment({
              name: e.currentTarget.name.value,
              email: e.currentTarget.email.value,
              content: e.currentTarget.content.value,
              idComment: comment.id,
            });
          }}
          className="flex flex-col self-stretch items-start gap-12 pl-48"
        >
          <textarea
            name="content"
            placeholder="content"
            className="self-stretch flex-1 px-12 py-8 rounded-sm border border-border-soft bg-white"
          />
          <div className="flex gap-12 lg:gap-24 flex-col lg:flex-row items-start self-stretch flex-1">
            <input
              type="text"
              name="name"
              placeholder="name"
              className="flex-1 px-16 py-8 rounded-sm border border-border-soft bg-white"
            />

            <input
              type="email"
              name="email"
              placeholder="email"
              className="flex-1 px-16 py-8 rounded-sm border border-border-soft bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="self-stretch px-24 py-10 justify-center gap-8 items-center rounded-xs bg-primary-base hover:bg-primary-dark transition-colors duration-300 ease-in-out flex"
          >
            <span className="text-white text-lg font-semibold">Comentar</span>
          </button>
        </form>
      </div>
      <ul className="pl-48 self-stretch flex flex-col gap-20">
        {comment.children.map((child) => (
          <li key={child.id} className="flex flex-col gap-12">
            <div className="flex items-center gap-16 self-stretch">
              <AvatarPhoto name={child.author.name} className={'size-32'} />
              <div className="flex flex-col">
                <div className="flex gap-8 items-center">
                  <p className="text-sm font-medium color-gray-800">{child.author.name}</p>
                  {child.isAdminComment && (
                    <span className="px-6 rounded-xs bg-primary-lighter text-xs text-primary-darker">
                      Moderador
                    </span>
                  )}
                </div>
                <time
                  className="text-xs text-gray-600"
                  dateTime={new Date(child.createdAt).toISOString()}
                >
                  {new Date(child.createdAt).toLocaleDateString('pt-br', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>
            <p className="flex-1 pl-48 text-sm text-gray-600 self-stretch">{child.content}</p>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Comments;
