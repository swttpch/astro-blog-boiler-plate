"use strict";

/**
 * A set of functions called "actions" for `article-interactivities`
 */

module.exports = {
  addLike: async (ctx) => {
    const params = ctx.params;
    const data = await strapi
      .service("api::article-interactivities.article-interactivities")
      .setLike({ id: params.id, operation: "add" });
    return data;
  },
  removeLike: async (ctx) => {
    const params = ctx.params;
    const data = await strapi
      .service("api::article-interactivities.article-interactivities")
      .setLike({ id: params.id, operation: "remove" });
    return data;
  },
  addShare: async (ctx) => {
    const params = ctx.params;
    const data = await strapi
      .service("api::article-interactivities.article-interactivities")
      .setShare({ id: params.id, operation: "add" });
    return data;
  },
  removeShare: async (ctx) => {
    const params = ctx.params;
    const data = await strapi
      .service("api::article-interactivities.article-interactivities")
      .setShare({ id: params.id, operation: "remove" });
    return data;
  },
};
