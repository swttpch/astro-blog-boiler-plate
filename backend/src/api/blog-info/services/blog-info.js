'use strict';

/**
 * blog-info service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::blog-info.blog-info');
