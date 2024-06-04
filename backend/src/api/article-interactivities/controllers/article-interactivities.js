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
  addUsefullCount: async (ctx) => {
    const params = ctx.params;
    const data = await strapi
      .service("api::article-interactivities.article-interactivities")
      .setUsefullCount({ id: params.id, operation: "add" });
    return data;
  },
  removeUsefullCount: async (ctx) => {
    const params = ctx.params;
    const data = await strapi
      .service("api::article-interactivities.article-interactivities")
      .setUsefullCount({ id: params.id, operation: "remove" });
    return data;
  },
  addUselessCount: async (ctx) => {
    const params = ctx.params;
    const data = await strapi
      .service("api::article-interactivities.article-interactivities")
      .setUselessCount({ id: params.id, operation: "add" });
    return data;
  },
  removeUselessCount: async (ctx) => {
    const params = ctx.params;
    const data = await strapi
      .service("api::article-interactivities.article-interactivities")
      .setUselessCount({ id: params.id, operation: "remove" });
    return data;
  },
};
