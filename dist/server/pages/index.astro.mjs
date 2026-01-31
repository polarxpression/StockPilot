/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro } from '../chunks/astro/server_B4G8Wsup.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_CE1coH0v.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "StockPilot" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashboardPage", null, { "client:only": "react", "pathname": Astro2.url.pathname, "client:component-hydration": "only", "client:component-path": "@/components/pages/dashboard-page", "client:component-export": "DashboardPage" })} ` })}`;
}, "C:/Users/Kabum/Desktop/StockPilot-Astro/src/pages/index.astro", void 0);

const $$file = "C:/Users/Kabum/Desktop/StockPilot-Astro/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
