/* empty css                           */
import { c as createAstro, d as createComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, i as renderSlot, j as renderComponent, l as renderHead } from '../astro_kNrZ8Xzf.mjs';
import 'kleur/colors';
import { f as fetchApi, a as getImage, b as getStyleBackgroundImage, $ as $$Screen, c as $$Container, d as $$Header, e as $$Footer, h as $$BaseHead, S as SITE_TITLE, j as SITE_DESCRIPTION } from './_slug__1xN2O5hQ.mjs';
import { twMerge } from 'tailwind-merge';
import 'clsx';

const $$Astro$2 = createAstro("https://example.com");
const $$CategoryBadge = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$CategoryBadge;
  const { class: className, ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(twMerge(
    "TypeTags px-12 py-4 flex justify-start items-center gap-8 bg-primary-lighter text-primary-base text-sm font-medium rounded-xs",
    className
  ), "class")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/CategoryBadge.astro", void 0);

const $$Astro$1 = createAstro("https://example.com");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Hero;
  const articles = await fetchApi({
    endpoint: "articles",
    wrappedByKey: "data",
    query: {
      populate: {
        mainImage: {
          fields: ["url", "alternativeText", "width", "height", "formats"]
        },
        categories: {
          fields: ["title"]
        }
      },
      pagination: {
        pageSize: 3
      },
      publicationState: "live"
    }
  });
  const imgUrl = `${process.env.NODE_ENV === "development" ? "http://localhost:1337" : ""}`;
  const betterImages = await Promise.all(
    articles.map(
      (el) => el.attributes.mainImage.data ? getImage({
        src: imgUrl + el.attributes.mainImage.data?.attributes.url,
        width: el.attributes.mainImage.data?.attributes.width,
        height: el.attributes.mainImage.data?.attributes.height,
        format: "webp"
      }) : void 0
    )
  );
  const bgs = betterImages.map((el) => {
    return getStyleBackgroundImage(el?.src);
  });
  return renderTemplate`${renderComponent($$result, "hero-data", "hero-data", { "data-articles": articles, "data-bgs": bgs }, { "default": () => renderTemplate` ${renderComponent($$result, "Screen", $$Screen, { "id": "hero", "class": "h-[481px] justify-end", "style": bgs[0] }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, { "class": "items-end justify-between z-10" }, { "default": ($$result3) => renderTemplate`${articles.map((article, index) => renderTemplate`${maybeRenderHead()}<div${addAttribute(`article-content-${index} hidden Row flex-1 data-[active]:flex justify-start items-end gap-[48px] max-w-[640px]`, "class")}> <div class="Content flex-1 flex flex-col justify-start items-start gap-[24px] "> ${article.attributes.categories.data && renderTemplate`${renderComponent($$result3, "CategoryBadge", $$CategoryBadge, {}, { "default": ($$result4) => renderTemplate`${article.attributes.categories.data[0].attributes.title}` })}`} <div class="TitleParagraph self-stretch flex flex-col justify-start items-start gap-[16px]"> <a${addAttribute(article.attributes.slug, "href")} class="AsTrSPaletasDeSombrasQuePossuoEComoReduzirSeuEstoque self-stretch text-white text-[36px] font-medium leading-[40px]"> ${article.attributes.title} </a> </div> </div> </div>`)}<div class="Frame1261153263 flex justify-start items-start gap-[12px]"> ${articles?.map((el, index) => renderTemplate`<button${addAttribute(index, "data-index")}${addAttribute(index === 0, "data-active")}${addAttribute([
    "article-tab transition-all w-12 data-[active]:w-32 h-[12px] bg-white bg-opacity-60 data-[active]:bg-opacity-1 data-[active]:bg-primary-base rounded-full",
    `article-tab-${index}`
  ], "class:list")}></button>`)} </div> ` })} ` })} ${renderComponent($$result, "Screen", $$Screen, { "class": "bg-primary-950 py-0 lg:py-0" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, { "class": "items-stretch justify-stretch gap-0 lg:py-0" }, { "default": ($$result3) => renderTemplate`${articles?.map((el, index) => {
    const category = el.attributes.categories.data?.[0].attributes.title;
    const published_at = new Date(el.attributes.createdAt).toLocaleDateString("pt-BR");
    const reading_time = el.attributes.readingTime;
    const slug = el.attributes.slug;
    const title = el.attributes.title;
    return renderTemplate`${renderComponent($$result3, "article-template", "article-template", { "data-index": index, "class": "self-stretch flex-1" }, { "default": () => renderTemplate` <a${addAttribute(slug, "href")} class="flex-1 self-stretch "> <div${addAttribute(index === 0, "data-active")}${addAttribute([
      "Content p-32 data-[active]:bg-[rgb(255,255,255)]/5 border-t-4 border-transparent data-[active]:border-primary-base flex flex-col justify-center items-start gap-[16px] flex-1",
      `hero-article-${index}`
    ], "class:list")}> <div class="HeadingParagraph self-stretch h-[56px] flex flex-col justify-start items-start gap-[16px]"> <div class="CategoryTitle self-stretch h-[56px] flex flex-col justify-start items-start gap-[8px]"> <p class="title self-stretch text-white text-lg font-medium">${title}</p> </div> </div> <div class="self-stretch flex justify-between items-center"> ${category && renderTemplate`${renderComponent($$result3, "CategoryBadge", $$CategoryBadge, { "class": "self-start" }, { "default": ($$result4) => renderTemplate`${category}` })}`} <div class="self-stretch text-primary-lighter text-xs font-medium"> ${published_at} • ${reading_time} min de leitura
</div> </div> </div> </a> ` })}`;
  })}` })} ` })} ` })} `;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/components/home/Hero.astro", void 0);

const $$Astro = createAstro("https://example.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const blogInfo = await fetchApi({
    endpoint: "blog-info",
    query: {
      populate: "*"
    }
  });
  return renderTemplate`<html lang="en"> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { "title": SITE_TITLE, "description": SITE_DESCRIPTION })}${renderHead()}</head> <body> ${renderComponent($$result, "Header", $$Header, { "brand": blogInfo.data.attributes.brand.data })} ${renderComponent($$result, "Hero", $$Hero, {})} ${renderComponent($$result, "Footer", $$Footer, { "brand": blogInfo.data.attributes.brand.data, "description": blogInfo.data.attributes.summary, "name": blogInfo.data.attributes.name, "socials": blogInfo.data.attributes.socials })} </body></html>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/pages/index.astro", void 0);

const $$file = "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
