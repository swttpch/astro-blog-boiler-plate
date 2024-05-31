import { join } from "path";
import mailer from "nodemailer/lib/mailer";

export const emailAttach = {
  attachments: [
    {
      filename: "full-locasty-logo.png",
      path: join(__dirname, "../public/images/full-locasty-logo.png"),
      cid: "full-locasty-logo.png",
      contentDisposition: "inline",
    },
    {
      filename: "facebook-logo.png",
      path: join(__dirname, "../public/images/facebook-logo.png"),
      cid: "facebook-logo.png",
      contentDisposition: "inline",
    },
    {
      filename: "instagram-logo.png",
      path: join(__dirname, "../public/images/instagram-logo.png"),
      cid: "instagram-logo.png",
      contentDisposition: "inline",
    },
    {
      filename: "linkedin-logo.png",
      path: join(__dirname, "../public/images/linkedin-logo.png"),
      cid: "linkedin-logo.png",
      contentDisposition: "inline",
    },
  ],
};

export const reportAttach = {
  attachments: [
    {
      filename: "right-arrow-icon.png",
      path: join(__dirname, "../public/images/right-arrow-icon.png"),
      cid: "right-arrow-icon.png",
      contentDisposition: "inline",
    },
    {
      filename: "location-pin-icon.png",
      path: join(__dirname, "../public/images/location-pin-icon.png"),
      cid: "location-pin-icon.png",
      contentDisposition: "inline",
    },
    {
      filename: "shop-icon.png",
      path: join(__dirname, "../public/images/shop-icon.png"),
      cid: "shop-icon.png",
      contentDisposition: "inline",
    },
    {
      filename: "clock-icon.png",
      path: join(__dirname, "../public/images/clock-icon.png"),
      cid: "clock-icon.png",
      contentDisposition: "inline",
    },
    {
      filename: "comment-x-icon.png",
      path: join(__dirname, "../public/images/comment-x-icon.png"),
      cid: "comment-x-icon.png",
      contentDisposition: "inline",
    },
  ],
};

export const greenArrowUpAttach = {
  attachments: [
    {
      filename: "green-arrow-up.png",
      path: join(__dirname, "../public/images/green-arrow-up.png"),
      cid: "green-arrow-up.png",
      contentDisposition: "inline",
    },
  ],
};

export const redArrowDownAttach = {
  attachments: [
    {
      filename: "red-arrow-down.png",
      path: join(__dirname, "../public/images/red-arrow-down.png"),
      cid: "red-arrow-down.png",
      contentDisposition: "inline",
    },
  ],
};

export const insightsReportAttach = {
  attachments: [
    {
      filename: "search-icon.png",
      path: join(__dirname, "../public/images/search-icon.png"),
      cid: "search-icon.png",
      contentDisposition: "inline",
    },
    {
      filename: "maps-icon.png",
      path: join(__dirname, "../public/images/maps-icon.png"),
      cid: "maps-icon.png",
      contentDisposition: "inline",
    },
    {
      filename: "phone-icon.png",
      path: join(__dirname, "../public/images/phone-icon.png"),
      cid: "phone-icon.png",
      contentDisposition: "inline",
    },
    {
      filename: "path-plus-icon.png",
      path: join(__dirname, "../public/images/path-plus-icon.png"),
      cid: "path-plus-icon.png",
      contentDisposition: "inline",
    },
    {
      filename: "click-icon.png",
      path: join(__dirname, "../public/images/click-icon.png"),
      cid: "click-icon.png",
      contentDisposition: "inline",
    },
    {
      filename: "comment-icon.png",
      path: join(__dirname, "../public/images/comment-icon.png"),
      cid: "comment-icon.png",
      contentDisposition: "inline",
    },
    {
      filename: "star-icon.png",
      path: join(__dirname, "../public/images/star-icon.png"),
      cid: "star-icon.png",
      contentDisposition: "inline",
    },
  ],
};
