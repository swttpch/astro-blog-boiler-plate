export default ({ env }) => ({
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  // upload: {
  //   config: {
  //     provider: "aws-s3",
  //     providerOptions: {
  //       s3Options: {
  //         accessKeyId: env("AWS_ACCESS_KEY_ID"),
  //         secretAccessKey: env("AWS_ACCESS_SECRET"),
  //         region: env("AWS_REGION"),
  //         params: {
  //           ACL: env("AWS_ACL", "public-read"),
  //           Bucket: env("AWS_BUCKET_NAME"),
  //         },
  //       },
  //     },
  //     actionOptions: {
  //       upload: {},
  //       uploadStream: {},
  //       delete: {},
  //     },
  //   },
  // },
  seo: {
    enabled: true,
  },
  publisher: {
    enabled: true,
  },
  navigation: { enabled: true },
  "strapi-plugin-populate-deep": {
    config: {
      defaultDepth: 5,
    },
  },
  ezforms: {
    config: {
      captchaProvider: {
        name: "none",
      },
      notificationProviders: [
        {
          name: "email",
          enabled: true,
          config: {
            subject: "Mail from Ecto blog-system", // Optional
            from: "no-reply@strapi.io",
          },
        },
      ],
    },
  },
  // search: {
  //   enabled: true,
  //   config: {
  //     provider: "algolia",
  //     excludedFields: ["createdAt", "createdBy", "updatedBy"],
  //     providerOptions: {
  //       apiKey: env("ALGOLIA_PROVIDER_ADMIN_API_KEY"),
  //       applicationId: env("ALGOLIA_PROVIDER_APPLICATION_ID"),
  //     },
  //     contentTypes: [
  //       {
  //         name: "api::article.article",
  //         index: env("ALGOLIA_INDEX"),
  //         fields: ["id", "title", "url", "previewText"],
  //       },
  //     ],
  //   },
  // },
  "import-export-entries": {
    enabled: true,
  },
  graphql: {
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 30,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
});
