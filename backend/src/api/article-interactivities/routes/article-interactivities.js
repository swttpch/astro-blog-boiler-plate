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
      path: "/article-interactivities/:id/usefull-count/add",
      handler: "article-interactivities.addUsefullCount",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/article-interactivities/:id/usefull-count/remove",
      handler: "article-interactivities.removeUsefullCount",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/article-interactivities/:id/useless-count/add",
      handler: "article-interactivities.addUselessCount",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/article-interactivities/:id/useless-count/remove",
      handler: "article-interactivities.removeUselessCount",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
