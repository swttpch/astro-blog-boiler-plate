"use strict";

/**
 * article-interactivities service
 */

module.exports = ({}) => ({
  setLike: async ({ id, operation }) => {
    const op = operation === "add" ? 1 : -1;
    const entry = await strapi.entityService.findOne(
      "api::article.article",
      +id
    );
    const newEntity = await strapi.entityService.update(
      "api::article.article",
      +id,
      {
        fields: ["likes", "shares"],
        data: {
          likes: entry.likes + op,
        },
      }
    );

    return newEntity;
  },
  setShare: async ({ id, operation }) => {
    const op = operation === "add" ? 1 : -1;
    const entry = await strapi.entityService.findOne(
      "api::article.article",
      +id
    );
    const newEntity = await strapi.entityService.update(
      "api::article.article",
      +id,
      {
        fields: ["likes", "shares"],
        data: {
          shares: entry.shares + op,
        },
      }
    );

    return newEntity;
  }
});
