module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/article-interactivities/:id/likes/add",
      handler: "article-interactivities.addLike",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/article-interactivities/:id/likes/remove",
      handler: "article-interactivities.removeLike",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/article-interactivities/:id/shares/add",
      handler: "article-interactivities.addShare",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/article-interactivities/:id/shares/remove",
      handler: "article-interactivities.removeShare",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
