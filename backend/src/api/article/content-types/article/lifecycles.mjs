import readingTime from "reading-time";

export async function beforeCreate(event) {
  const { data } = event.params;
  if (data.content && data.content?.length > 0) {
    data.readingTime = Math.round(readingTime(data.content)?.minutes) || null;
  }
  console.log(data);
}
export async function beforeUpdate(event) {
  const { data } = event.params;
  if (data.content && data.content?.length > 0) {
    data.readingTime = Math.round(readingTime(data.content)?.minutes) || null;
  }
  console.log(data);
  const article = await strapi.db.query("api::article.article").findOne({
    where: {
      slug: data.slug,
    },
  });
}
