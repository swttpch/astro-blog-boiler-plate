"use strict";
const readingTime = require("reading-time");
module.exports = {
    async beforeCreate(event) {
      const { data } = event.params;
      if (data.content && data.content?.length > 0) {
        data.readingTime = Math.round(readingTime(data.content)?.minutes) || null;
      }
    },
    async beforeUpdate(event) {
      const { data } = event.params;
      if (data.content && data.content?.length > 0) {
        data.readingTime = Math.round(readingTime(data.content)?.minutes) || null;
      }
    },
};