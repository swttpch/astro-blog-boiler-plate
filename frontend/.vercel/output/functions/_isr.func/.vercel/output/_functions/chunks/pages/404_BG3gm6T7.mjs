/* empty css                           */
import { c as createAstro, d as createComponent, r as renderTemplate, m as maybeRenderHead } from '../astro_kNrZ8Xzf.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://example.com");
const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$404;
  return renderTemplate`${maybeRenderHead()}<h1>ERROOO</h1>`;
}, "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/pages/404.astro", void 0);

const $$file = "/Users/igor-souza/repositories/astro-blog-boiler-plate/frontend/src/pages/404.astro";
const $$url = "/404";

export { $$404 as default, $$file as file, $$url as url };
