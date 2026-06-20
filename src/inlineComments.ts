// DOM helpers for Google-Docs-style inline commenting: capturing a text
// selection with context, and re-locating + highlighting quoted ranges.
import type { CommentT } from "./commentsClient";

export interface SelectionContext {
  quote: string;
  prefix: string;
  suffix: string;
  anchor: string; // nearest heading id
  rect: DOMRect;
}

const CTX = 32; // chars of context to capture each side

function nearestHeadingId(node: Node | null, root: HTMLElement): string {
  const headings = Array.from(
    root.querySelectorAll<HTMLElement>("h1[id],h2[id],h3[id],h4[id]")
  );
  if (!node || !headings.length) return "";
  let best = "";
  for (const h of headings) {
    // heading is before the node?
    const pos = h.compareDocumentPosition(node);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) best = h.id;
    else break;
  }
  return best;
}

// Read the current selection (must be inside root) into an anchorable context.
export function readSelection(root: HTMLElement): SelectionContext | null {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;
  // prefer the selection text; fall back to the range text
  const quote = (sel.toString() || range.toString()).replace(/\s+/g, " ").trim();
  if (quote.length < 2) return null;

  // prefix/suffix from the surrounding text nodes
  const startText = range.startContainer.textContent || "";
  const endText = range.endContainer.textContent || "";
  const prefix = startText.slice(Math.max(0, range.startOffset - CTX), range.startOffset).replace(/\s+/g, " ");
  const suffix = endText.slice(range.endOffset, range.endOffset + CTX).replace(/\s+/g, " ");

  const rect = range.getBoundingClientRect();
  const anchor = nearestHeadingId(range.startContainer, root);
  return { quote, prefix, suffix, anchor, rect };
}

// Remove all existing highlight wrappers (restore plain text).
export function clearHighlights(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("mark.cmt-highlight").forEach((m) => {
    const parent = m.parentNode;
    if (!parent) return;
    while (m.firstChild) parent.insertBefore(m.firstChild, m);
    parent.removeChild(m);
    parent.normalize();
  });
}

interface FlatNode {
  node: Text;
  start: number;
}

function flatten(root: HTMLElement): { text: string; nodes: FlatNode[] } {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      (n.parentElement &&
        n.parentElement.closest("pre, code, .cmt-marker, .mermaid-wrap"))
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });
  const nodes: FlatNode[] = [];
  let text = "";
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const t = n as Text;
    nodes.push({ node: t, start: text.length });
    text += t.nodeValue || "";
  }
  return { text, nodes };
}

function locate(nodes: FlatNode[], idx: number): { node: Text; offset: number } | null {
  for (let i = 0; i < nodes.length; i++) {
    const cur = nodes[i];
    const len = cur.node.nodeValue?.length || 0;
    if (idx >= cur.start && idx <= cur.start + len) {
      return { node: cur.node, offset: idx - cur.start };
    }
  }
  return null;
}

// normalize whitespace the same way the quote was captured, so indices line up
const norm = (s: string) => s.replace(/\s+/g, " ");

// Wrap the quoted ranges for each comment. Returns ids that could not be found.
export function applyHighlights(
  root: HTMLElement,
  comments: CommentT[],
  counts: Map<string, number>
): Set<string> {
  clearHighlights(root);
  const orphans = new Set<string>();
  const withQuote = comments.filter((c) => c.quote && c.quote.length >= 2);
  if (!withQuote.length) return orphans;

  // group by quote+anchor so multiple comments on the same text share one mark
  for (const c of withQuote) {
    const flat = flatten(root); // re-flatten each time (DOM changes as we wrap)
    const ntext = norm(flat.text);
    const quote = norm(c.quote!);
    let at = -1;
    if (c.prefix) {
      const p = ntext.indexOf(norm(c.prefix) + quote);
      if (p >= 0) at = p + norm(c.prefix).length;
    }
    if (at < 0) at = ntext.indexOf(quote);
    if (at < 0) {
      orphans.add(c.id);
      continue;
    }
    const start = locate(flat.nodes, at);
    const end = locate(flat.nodes, at + quote.length);
    if (!start || !end) {
      orphans.add(c.id);
      continue;
    }
    const range = document.createRange();
    try {
      range.setStart(start.node, start.offset);
      range.setEnd(end.node, end.offset);
      const mark = document.createElement("mark");
      mark.className = "cmt-highlight";
      mark.dataset.commentId = c.id;
      mark.dataset.count = String(counts.get(c.id) || 1);
      mark.title = "Click to view comment";
      range.surroundContents(mark);
    } catch {
      // selection crosses block boundaries — can't wrap cleanly
      orphans.add(c.id);
    }
  }
  return orphans;
}
