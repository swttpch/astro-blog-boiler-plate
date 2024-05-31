"use strict";
const readingTime = require("reading-time");

const getAlgoliaIndex = require("../../../../../lib/algolia.js");

const index = getAlgoliaIndex(`${process.env.ALGOLIA_BLOG_INDEX}`);

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (data.content && data.content?.length > 0) {
      data.readingTime =
        Math.round(readingTime.default(data.content)?.minutes) || null;
    }
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    if (data.content && data.content?.length > 0) {
      data.readingTime =
        Math.round(readingTime.default(data.content)?.minutes) || null;
    }
  },
  async afterCreate(event) {
    const { data } = event.params;

    const article = await strapi.db.query("api::article.article").findOne({
      where: {
        url: data.url,
      },
    });

    const { id, title, url } = article;

    try {
      await index.saveObject({ objectID: id, title, id, url });
      console.log("Article saved to Algolia");
    } catch (error) {
      console.error("Error saving article to Algolia", error);
    }
  },
  async afterUpdate(event) {
    const { data } = event.params;

    const article = await strapi.db.query("api::article.article").findOne({
      where: {
        url: data.url,
      },
    });

    const { id, title, url } = article;

    try {
      await index.partialUpdateObject({ objectID: id, title, id, url });
      console.log("Article updated in Algolia");
    } catch (error) {
      console.error("Error updating article in Algolia", error);
    }
  },
};
