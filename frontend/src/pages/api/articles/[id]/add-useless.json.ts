import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify('id não encontrado'), { status: 400 });
  }

  const res = await fetch(
    import.meta.env.STRAPI_URL + `/api/article-interactivities/${id}/useless-count/add`,
    {
      headers: { Authorization: `Bearer ${import.meta.env.STRAPI_JWT}` },
      method: 'PUT',
    },
  );
  const data = await res.json();

  return new Response(JSON.stringify(data));
};
