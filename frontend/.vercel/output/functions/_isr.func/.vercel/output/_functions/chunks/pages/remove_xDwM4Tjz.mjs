const GET = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify("id não encontrado"), { status: 400 });
  }
  const res = await fetch(
    `http://localhost:1337/api/article-interactivities/${id}/likes/remove`,
    {
      headers: { Authorization: `Bearer ${"0c7be662cd4178bf441ac79a8c1691f18d2988285e4184291ce071691e41f8083062e1c419bb064237b1e1ef43c97a41bab774b45b63f720b076383687551c0fdb2a89e07877349894b71156b88789a4a57e94ea42bf67b6d0087272c70efa04db2219d68eb6d343754b4f97fef054ad851eff628a2d8c149bdb010e61c0d805"}` },
      method: "PUT"
    }
  );
  const data = await res.json();
  return new Response(JSON.stringify(data));
};

export { GET };
