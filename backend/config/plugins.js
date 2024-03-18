module.exports = ({ env }) => ({
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  publisher: {
    enabled: true,
  },
  navigation: { enabled: true },
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
  seo: {
    enabled: true,
  },
});
