"use client";

import { createElement, type ReactNode } from "react";
import Image from "next/image";
import { parseDocument } from "htmlparser2";

type HtmlNode = ReturnType<typeof parseDocument>["children"][number];
const allowed = new Set(["div", "section", "p", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "em", "b", "i", "u", "s", "a", "ul", "ol", "li", "blockquote", "pre", "code", "br", "hr", "figure", "figcaption", "table", "thead", "tbody", "tfoot", "tr", "th", "td", "span", "sup", "sub"]);
const excluded = new Set(["script", "style", "link", "meta", "iframe", "object", "embed", "form", "input", "button", "svg", "math", "template"]);
const wordpressOrigin = "https://prodeveloper2.com";

function safeUrl(value: string, image = false) {
  if (!value) return undefined;
  try {
    const url = new URL(value, wordpressOrigin);
    if (!(image ? ["http:", "https:"] : ["http:", "https:", "mailto:", "tel:"]).includes(url.protocol)) return undefined;
    if (image) {
      // The reference article uses assets shipped with this app as well as
      // images hosted in the WordPress uploads directory.
      if (url.pathname.startsWith("/assets/")) return `${url.pathname}${url.search}`;
      if (url.hostname !== "prodeveloper2.com" || !url.pathname.startsWith("/wp-content/uploads/")) return undefined;
      url.protocol = "https:";
    }
    return url.href;
  } catch { return undefined; }
}

function renderNode(node: HtmlNode, key: string): ReactNode {
  if (node.type === "text") return node.data;
  if (!("attribs" in node) || excluded.has(node.name)) return null;
  if (node.name === "img") {
    const raw = node.attribs["data-lazy-src"] || node.attribs.src;
    const src = raw ? safeUrl(raw, true) : undefined;
    if (!src) return null;
    return <span key={key} className="blog-content-image relative mx-auto my-2.5 block h-64 w-4/5 overflow-hidden rounded-[15px] sm:h-87.5">
      <Image src={src} alt={node.attribs.alt || ""} fill sizes="(max-width: 767px) 90vw, 650px" className="object-cover" />
    </span>;
  }
  const children = node.children.map((child, index) => renderNode(child, `${key}.${index}`));
  if (!allowed.has(node.name)) return children;
  const props: Record<string, unknown> = { key };
  if (node.name === "a") {
    props.href = safeUrl(node.attribs.href || "");
    if (node.attribs.target === "_blank") { props.target = "_blank"; props.rel = "noopener noreferrer"; }
  }
  if (node.name === "th" || node.name === "td") {
    if (/^[1-9]\d?$/.test(node.attribs.colspan || "")) props.colSpan = Number(node.attribs.colspan);
    if (/^[1-9]\d?$/.test(node.attribs.rowspan || "")) props.rowSpan = Number(node.attribs.rowspan);
  }
  // CMS markup supplies semantic content only; scripts, event handlers, inline
  // styles, arbitrary attributes and executable URLs never reach the page.
  return createElement(node.name === "h1" ? "h2" : node.name, props, ...children);
}

export default function WordPressArticle({ html }: { html: string }) {
  return <div className="cms-rich-text">{parseDocument(html).children.map((node, index) => renderNode(node, String(index)))}</div>;
}
