// Must match the slugify used in backend/indexer.ts so heading anchors line up.
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s—-]/g, "")
    .trim()
    .replace(/[\s—]+/g, "-")
    .replace(/-+/g, "-");
}

// Pull plain text out of arbitrary React markdown children.
export function nodeText(children: any): string {
  if (children == null) return "";
  if (typeof children === "string" || typeof children === "number")
    return String(children);
  if (Array.isArray(children)) return children.map(nodeText).join("");
  if (children?.props?.children) return nodeText(children.props.children);
  return "";
}

export const SCR_RE = /^(SCR-[A-Z]+-\d+)/;
