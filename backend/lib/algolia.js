import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_PROVIDER_APPLICATION_ID,
  process.env.ALGOLIA_PROVIDER_ADMIN_API_KEY
);

const getAlgoliaIndex = (name) => {
  const index = client.initIndex(`${name}`);
  return index;
};

module.exports = getAlgoliaIndex;
