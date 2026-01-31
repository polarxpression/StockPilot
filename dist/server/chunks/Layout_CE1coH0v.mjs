import { e as createComponent, r as renderTemplate, l as renderSlot, n as renderHead, g as addAttribute, h as createAstro } from './astro/server_B4G8Wsup.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en" suppress-hydration-warning> <head><meta charset="UTF-8"><meta name="description" content="Intelligent Cartridge Inventory Management"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', "><title>", "</title>", '</head> <body class="font-sans antialiased"> ', " <script>\n	const getThemePreference = () => {\n		if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {\n			return localStorage.getItem('theme');\n		}\n		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';\n	};\n	const isDark = getThemePreference() === 'dark';\n	document.documentElement.classList[isDark ? 'add' : 'remove']('dark');\n \n	if (typeof localStorage !== 'undefined') {\n		const observer = new MutationObserver(() => {\n			const isDark = document.documentElement.classList.contains('dark');\n			localStorage.setItem('theme', isDark ? 'dark' : 'light');\n		});\n		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });\n	}\n<\/script></body></html>"])), addAttribute(Astro2.generator, "content"), title, renderHead(), renderSlot($$result, $$slots["default"]));
}, "C:/Users/Kabum/Desktop/StockPilot-Astro/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
