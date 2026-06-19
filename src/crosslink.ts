// A small rehype plugin that scans rendered text nodes for SRS identifiers and
// "(Part 8.1)" / "(Section 14.5)" references, turning them into clickable
// internal links. IDs are encoded as href="#xlink:ID"; part/section refs as
// href="#xsearch:...". The MarkdownView's <a> override interprets these.

const ID_RE =
  /\b(LMS-FR-\d+|LMS-NFR-\d+|LMS-TR-\d+|DEC-P1-\d+|BR-\d+|RISK-[A-Z]+-\d+|SCR-[A-Z]+-\d+|TC-[A-Z0-9]+-\d+)\b/g;

// (Part 8.1) (Section 14.5) (Part 9) — captured with optional leading word.
const REF_RE = /\b(Part|Section|Appendix)\s+([A-Z]?\d+(?:\.\d+)*)\b/g;

const SKIP_TAGS = new Set(["code", "pre", "a", "script", "style"]);

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function makeLink(text: string, href: string, soft = false): HastNode {
  return {
    type: "element",
    tagName: "a",
    properties: { href, className: soft ? ["xlink", "soft"] : ["xlink"] },
    children: [{ type: "text", value: text }],
  };
}

// Split one text node's value into a mix of text + link nodes.
function tokenize(value: string): HastNode[] | null {
  interface Hit {
    start: number;
    end: number;
    node: HastNode;
  }
  const hits: Hit[] = [];

  ID_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ID_RE.exec(value))) {
    hits.push({
      start: m.index,
      end: m.index + m[0].length,
      node: makeLink(m[0], `#xlink:${m[0]}`),
    });
  }
  REF_RE.lastIndex = 0;
  while ((m = REF_RE.exec(value))) {
    hits.push({
      start: m.index,
      end: m.index + m[0].length,
      node: makeLink(m[0], `#xsearch:${encodeURIComponent(m[0])}`, true),
    });
  }
  if (!hits.length) return null;

  // resolve overlaps: keep earliest, drop those overlapping it
  hits.sort((a, b) => a.start - b.start || b.end - a.end);
  const kept: Hit[] = [];
  let cursor = 0;
  for (const h of hits) {
    if (h.start >= cursor) {
      kept.push(h);
      cursor = h.end;
    }
  }

  const out: HastNode[] = [];
  let pos = 0;
  for (const h of kept) {
    if (h.start > pos)
      out.push({ type: "text", value: value.slice(pos, h.start) });
    out.push(h.node);
    pos = h.end;
  }
  if (pos < value.length) out.push({ type: "text", value: value.slice(pos) });
  return out;
}

function walk(node: HastNode) {
  if (!node.children) return;
  const next: HastNode[] = [];
  for (const child of node.children) {
    if (child.type === "text" && typeof child.value === "string") {
      const replaced = tokenize(child.value);
      if (replaced) next.push(...replaced);
      else next.push(child);
    } else {
      if (
        child.type === "element" &&
        child.tagName &&
        SKIP_TAGS.has(child.tagName)
      ) {
        next.push(child);
      } else {
        walk(child);
        next.push(child);
      }
    }
  }
  node.children = next;
}

export function rehypeCrossLinks() {
  return (tree: HastNode) => {
    walk(tree);
  };
}
