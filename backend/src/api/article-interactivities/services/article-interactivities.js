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
        fields: ["likes", "usefullCount", "uselessCount"],
        data: {
          likes: entry.likes + op,
        },
      }
    );

    return newEntity;
  },

  setUsefullCount: async ({ id, operation }) => {
    const op = operation === "add" ? 1 : -1;
    const entry = await strapi.entityService.findOne(
      "api::article.article",
      +id
    );
    const newEntity = await strapi.entityService.update(
      "api::article.article",
      +id,
      {
        fields: ["likes", "usefullCount", "uselessCount"],
        data: {
          usefullCount: entry.usefullCount + op,
        },
      }
    );

    return newEntity;
  },

  setUselessCount: async ({ id, operation }) => {
    const op = operation === "add" ? 1 : -1;
    const entry = await strapi.entityService.findOne(
      "api::article.article",
      +id
    );
    const newEntity = await strapi.entityService.update(
      "api::article.article",
      +id,
      {
        fields: ["likes", "usefullCount", "uselessCount"],
        data: {
          uselessCount: entry.uselessCount + op,
        },
      }
    );

    return newEntity;
  },
});
