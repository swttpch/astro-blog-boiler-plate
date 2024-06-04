import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './chunks/astro_kNrZ8Xzf.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.BSTOsfDQ.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/articles/[id]/add-usefull.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/articles\\/([^/]+?)\\/add-usefull\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"articles","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"add-usefull.json","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/articles/[id]/add-usefull.json.ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/articles/[id]/add-useless.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/articles\\/([^/]+?)\\/add-useless\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"articles","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"add-useless.json","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/articles/[id]/add-useless.json.ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/articles/[id]/likes/add.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/articles\\/([^/]+?)\\/likes\\/add\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"articles","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"likes","dynamic":false,"spread":false}],[{"content":"add.json","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/articles/[id]/likes/add.json.ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/articles/[id]/likes/remove.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/articles\\/([^/]+?)\\/likes\\/remove\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"articles","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"likes","dynamic":false,"spread":false}],[{"content":"remove.json","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/articles/[id]/likes/remove.json.ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BKhIfMWM.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.BSTOsfDQ.css"},{"type":"external","src":"/_astro/_slug_.CjR1LpuO.css"},{"type":"inline","content":"#progress-bar[data-astro-cid-j5hbaivd]{--scrollAmount: 0%;width:var(--scrollAmount);transition:width .1s}\n"}],"routeData":{"route":"/[slug]","isIndex":false,"type":"page","pattern":"^\\/([^/]+?)\\/?$","segments":[[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/[slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"class m extends HTMLElement{index=0;indexes=[0,1,2];bgs=this.dataset.bgs?.replaceAll(\",b\",\"b\").split(\";\");interval=setInterval(()=>{this.index===2?this.index=0:this.index++,this.indexes.forEach((A,t)=>{const r=this.querySelector(`.hero-article-${t}`),i=this.querySelector(`.article-tab-${t}`),c=this.querySelector(`.article-content-${t}`),e=this.querySelector(`.article-banner-${t}`);t===this.index?(r?.setAttribute(\"data-active\",\"true\"),i?.setAttribute(\"data-active\",\"true\"),c?.setAttribute(\"data-active\",\"true\"),e?.setAttribute(\"data-active\",\"true\")):(r?.removeAttribute(\"data-active\"),i?.removeAttribute(\"data-active\"),c?.removeAttribute(\"data-active\"),e?.removeAttribute(\"data-active\")),document.querySelector(\"#hero\")?.setAttribute(\"style\",this.bgs?.[this.index]||\"\")})},5e3);constructor(){super(),this.querySelector(\"#hero\")?.style.setProperty(\"backgroung\",this.bgs?.[0]||\"\"),this.querySelector(\".hero-article-0\")?.setAttribute(\"data-active\",\"true\"),this.querySelector(\".article-tab-0\")?.setAttribute(\"data-active\",\"true\"),this.querySelector(\".article-content-0\")?.setAttribute(\"data-active\",\"true\"),this.querySelector(\".article-banner-0\")?.setAttribute(\"data-active\",\"true\"),this.querySelectorAll(\".article-tab\").forEach(t=>{const r=t.attributes.getNamedItem(\"data-index\")?.value;r&&t.addEventListener(\"click\",i=>{this.indexes.forEach((c,e)=>{const s=document.querySelector(`.hero-article-${e}`),u=document.querySelector(`.article-tab-${e}`),o=document.querySelector(`.article-content-${e}`),n=document.querySelector(`.article-banner-${e}`);clearInterval(this.interval),this.index=+r,e===+r?(s?.setAttribute(\"data-active\",\"true\"),u?.setAttribute(\"data-active\",\"true\"),o?.setAttribute(\"data-active\",\"true\"),n?.setAttribute(\"data-active\",\"true\")):(s?.removeAttribute(\"data-active\"),u?.removeAttribute(\"data-active\"),o?.removeAttribute(\"data-active\"),n?.removeAttribute(\"data-active\")),document.querySelector(\"#hero\")?.setAttribute(\"style\",this.bgs?.[this.index]||\"\"),this.interval=setInterval(()=>{this.index===2?this.index=0:this.index++,this.indexes.forEach((q,a)=>{const l=this.querySelector(`.hero-article-${a}`),d=this.querySelector(`.article-tab-${a}`),b=this.querySelector(`.article-content-${a}`),h=this.querySelector(`.article-banner-${a}`);a===this.index?(l?.setAttribute(\"data-active\",\"true\"),d?.setAttribute(\"data-active\",\"true\"),b?.setAttribute(\"data-active\",\"true\"),h?.setAttribute(\"data-active\",\"true\")):(l?.removeAttribute(\"data-active\"),d?.removeAttribute(\"data-active\"),b?.removeAttribute(\"data-active\"),h?.removeAttribute(\"data-active\")),document.querySelector(\"#hero\")?.setAttribute(\"style\",this.bgs?.[this.index]||\"\")})},5e3)})})})}}class y extends HTMLElement{constructor(){super()}}customElements.define(\"hero-data\",m);customElements.define(\"article-template\",y);\n"}],"styles":[{"type":"external","src":"/_astro/_slug_.BSTOsfDQ.css"},{"type":"external","src":"/_astro/_slug_.CjR1LpuO.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://example.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/pages/[slug].astro",{"propagation":"none","containsHead":true}],["/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/pages/index.astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/pages/rss.xml.js",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@js",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/src/pages/404.astro":"chunks/pages/404_BG3gm6T7.mjs","/src/pages/api/articles/[id]/add-usefull.json.ts":"chunks/pages/add-usefull_C_92pxz2.mjs","/src/pages/api/articles/[id]/add-useless.json.ts":"chunks/pages/add-useless_DDDzHEQB.mjs","/src/pages/api/articles/[id]/likes/add.json.ts":"chunks/pages/add_BgR-Jlpn.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/pages/generic_BSnUubjk.mjs","/src/pages/index.astro":"chunks/pages/index_BICt1a0n.mjs","/src/pages/api/articles/[id]/likes/remove.json.ts":"chunks/pages/remove_xDwM4Tjz.mjs","/src/pages/rss.xml.js":"chunks/pages/rss_CgJN0SZd.mjs","\u0000@astrojs-manifest":"manifest_C8yC0oWd.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_DbZV74Sn.mjs","\u0000@astro-page:src/pages/404@_@astro":"chunks/404_Der0lezD.mjs","\u0000@astro-page:src/pages/api/articles/[id]/add-usefull.json@_@ts":"chunks/add-usefull_DK6r0TSj.mjs","\u0000@astro-page:src/pages/api/articles/[id]/add-useless.json@_@ts":"chunks/add-useless_5awYvkrd.mjs","\u0000@astro-page:src/pages/api/articles/[id]/likes/add.json@_@ts":"chunks/add_D-47TwG8.mjs","\u0000@astro-page:src/pages/api/articles/[id]/likes/remove.json@_@ts":"chunks/remove_CK-cvLo4.mjs","\u0000@astro-page:src/pages/rss.xml@_@js":"chunks/rss_B5E0On4z.mjs","\u0000@astro-page:src/pages/[slug]@_@astro":"chunks/_slug__BXa_zCeJ.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_BNHwcOpb.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/first-post.md?astroContentCollectionEntry=true":"chunks/first-post_CZIXPVJq.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/markdown-style-guide.md?astroContentCollectionEntry=true":"chunks/markdown-style-guide_CLgIWabz.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/second-post.md?astroContentCollectionEntry=true":"chunks/second-post_BDmriyKG.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/third-post.md?astroContentCollectionEntry=true":"chunks/third-post_Dp0MzEjn.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/using-mdx.mdx?astroContentCollectionEntry=true":"chunks/using-mdx_BAJ383bm.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/first-post.md?astroPropagatedAssets":"chunks/first-post_BF_24CF3.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/markdown-style-guide.md?astroPropagatedAssets":"chunks/markdown-style-guide_DkVk1yqc.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/second-post.md?astroPropagatedAssets":"chunks/second-post_B3iYo-ck.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/third-post.md?astroPropagatedAssets":"chunks/third-post_D7GIS8uw.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/using-mdx.mdx?astroPropagatedAssets":"chunks/using-mdx_DNoOpAKL.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/first-post.md":"chunks/first-post_7wJbPfAU.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/markdown-style-guide.md":"chunks/markdown-style-guide_Cbr-pzU1.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/second-post.md":"chunks/second-post_Du5geY_g.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/third-post.md":"chunks/third-post_Cs2yduv6.mjs","/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/content/blog/using-mdx.mdx":"chunks/using-mdx_DOn3GADJ.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.fPt_rI2t.js","/astro/hoisted.js?q=1":"_astro/hoisted.BKhIfMWM.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/_slug_.BSTOsfDQ.css","/_astro/_slug_.CjR1LpuO.css","/blog-placeholder-1.jpg","/blog-placeholder-2.jpg","/blog-placeholder-3.jpg","/blog-placeholder-4.jpg","/blog-placeholder-5.jpg","/blog-placeholder-about.jpg","/favicon.svg","/_astro/hoisted.BKhIfMWM.js","/fonts/atkinson-bold.woff","/fonts/atkinson-regular.woff"],"buildFormat":"directory"});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
