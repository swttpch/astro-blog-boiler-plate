"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ["api::category.category"],
      async afterFindMany(event) {
        const categories = event.result;
        for (const category of categories) {
          const count = await strapi.db.query("api::article.article").count({
            where: {
              categories: category.id,
            },
          });
          category.articlesCount = count;
          await strapi.db.query("api::category.category").update({
            where: { id: category.id },
            data: { articlesCount: count },
          });
        }
      },
    });
  },
};
