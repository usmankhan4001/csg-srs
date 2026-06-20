import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button, Textarea, Paper, Group, Text } from "@mantine/core";
import { IconMessagePlus } from "@tabler/icons-react";
import Mermaid from "./Mermaid";
import { rehypeCrossLinks } from "../crosslink";
import { slugify, nodeText, SCR_RE } from "../util";
import { readSelection, applyHighlights, type SelectionContext } from "../inlineComments";
import type { NavTarget } from "../types";
import type { CommentT } from "../commentsClient";

export interface InlineCommentPayload {
  quote: string;
  prefix: string;
  suffix: string;
  anchor: string;
  text: string;
}

interface Props {
  content: string;
  filePath: string;
  navTarget: NavTarget | null;
  wireframeImages: Set<string>;
  comments?: CommentT[];
  canComment?: boolean;
  onAddInline?: (p: InlineCommentPayload) => Promise<void> | void;
  onOpenComment?: (id: string) => void;
  onCrossLink: (id: string) => void;
  onSearchRef: (text: string) => void;
}

// Which wireframe image files exist for a given SCR id (bare + breakpoints).
function imagesFor(scr: string, available: Set<string>): string[] {
  const order = ["", "-desktop", "-tablet", "-mobile"];
  const exts = ["png", "jpg", "jpeg", "webp", "svg"];
  const found: string[] = [];
  for (const suffix of order)
    for (const ext of exts) {
      const name = `${scr}${suffix}.${ext}`;
      if (available.has(name)) found.push(name);
    }
  return found;
}

const looksAscii = (s: string) =>
  /[┌┐└┘│─┤├┬┴┼█▓▒░]/.test(s) || /[+|]{2,}/.test(s);

// Find the smallest sensible element that contains an exact ID, so we can
// scroll precisely to the requirement row / list item rather than a heading.
function findIdElement(root: HTMLElement, id: string): HTMLElement | null {
  const sel = "td,th,li,p,h1,h2,h3,h4,h5,h6,summary,a";
  const re = new RegExp(`\\b${id.replace(/[-]/g, "\\-")}\\b`);
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(sel));
  for (const el of nodes) {
    if (re.test(el.textContent || "")) {
      // for table cells, flash the whole row for visibility
      return (el.closest("tr") as HTMLElement) || el;
    }
  }
  return null;
}

function flash(el: HTMLElement) {
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.remove("flash-hi");
  void el.offsetWidth;
  el.classList.add("flash-hi");
}

// The actual markdown render is memoized separately so that navigation
// (which only changes navTarget) never re-parses the document or re-renders
// the Mermaid diagrams.
function MarkdownBody({
  content,
  wireframeImages,
  onCrossLink,
  onSearchRef,
}: Omit<Props, "navTarget" | "filePath">) {
  // tracks the most recent SCR heading rendered, for wireframe pairing
  const scrRef = useRef<string | null>(null);
  scrRef.current = null;

  const heading = (Tag: "h1" | "h2" | "h3" | "h4") => {
    return ({ children }: any) => {
      const text = nodeText(children);
      const id = slugify(text);
      if (Tag === "h2") {
        const m = text.match(SCR_RE);
        scrRef.current = m ? m[1] : null;
      }
      return <Tag id={id}>{children}</Tag>;
    };
  };

  return useMemo(
    () => (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeCrossLinks as any]}
        components={{
          h1: heading("h1"),
          h2: heading("h2"),
          h3: heading("h3"),
          h4: heading("h4"),
          a({ href, children }: any) {
            const h = String(href || "");
            if (h.startsWith("#xlink:"))
              return (
                <a
                  className="xlink"
                  onClick={(e) => {
                    e.preventDefault();
                    onCrossLink(h.slice("#xlink:".length));
                  }}
                >
                  {children}
                </a>
              );
            if (h.startsWith("#xsearch:"))
              return (
                <a
                  className="xlink soft"
                  onClick={(e) => {
                    e.preventDefault();
                    onSearchRef(decodeURIComponent(h.slice("#xsearch:".length)));
                  }}
                >
                  {children}
                </a>
              );
            const external = /^https?:/.test(h);
            return (
              <a
                href={h}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
          pre({ children }: any) {
            const codeEl: any = Array.isArray(children)
              ? children[0]
              : children;
            const cls: string = codeEl?.props?.className || "";
            const raw = nodeText(codeEl?.props?.children).replace(/\n$/, "");

            if (cls.includes("language-mermaid"))
              return <Mermaid code={raw} />;

            const scr = scrRef.current;
            const imgs = scr ? imagesFor(scr, wireframeImages) : [];
            const ascii = looksAscii(raw);

            if (scr && imgs.length) {
              return (
                <div>
                  {imgs.map((f) => (
                    <figure key={f} style={{ margin: "0.5em 0" }}>
                      <img
                        src={`/wireframes/${f}`}
                        alt={`${scr} wireframe`}
                        style={{
                          maxWidth: "100%",
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                        }}
                      />
                      <figcaption style={{ fontSize: 12, color: "#64748b" }}>
                        Lo-fi wireframe — {f}
                      </figcaption>
                    </figure>
                  ))}
                  <details>
                    <summary
                      style={{ cursor: "pointer", fontSize: 13, color: "#475569" }}
                    >
                      Show text layout
                    </summary>
                    <pre className="ascii-wf">{raw}</pre>
                  </details>
                </div>
              );
            }

            return <pre className={ascii ? "ascii-wf" : ""}>{raw}</pre>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [content, wireframeImages]
  );
}

export default function MarkdownView({
  content,
  filePath,
  navTarget,
  wireframeImages,
  comments,
  canComment,
  onAddInline,
  onOpenComment,
  onCrossLink,
  onSearchRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<SelectionContext | null>(null);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const selRangeRef = useRef<Range | null>(null);

  // ----- inline comment highlights (Google-Docs style) -----
  // de-duplicate by quote so multiple comments on the same text share one mark
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const reps: CommentT[] = [];
    const counts = new Map<string, number>();
    const seen = new Map<string, CommentT>();
    for (const c of comments || []) {
      if (!c.quote) continue;
      const key = `${c.anchor}|${c.quote}`;
      if (seen.has(key)) {
        const rep = seen.get(key)!;
        counts.set(rep.id, (counts.get(rep.id) || 1) + 1);
      } else {
        seen.set(key, c);
        reps.push(c);
        counts.set(c.id, 1);
      }
    }
    applyHighlights(root, reps, counts);
  }, [content, comments, navTarget?.nonce]);

  // click a highlight -> open its thread
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !onOpenComment) return;
    const handler = (e: MouseEvent) => {
      const mark = (e.target as HTMLElement)?.closest?.("mark.cmt-highlight") as HTMLElement | null;
      if (mark?.dataset.commentId) {
        e.preventDefault();
        onOpenComment(mark.dataset.commentId);
      }
    };
    root.addEventListener("click", handler);
    return () => root.removeEventListener("click", handler);
  }, [onOpenComment]);

  // capture a text selection to offer "Comment"
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !canComment) return;
    const onUp = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(".cmt-composer-card, .cmt-margin-icon")) return;
      const ctx = readSelection(root);
      if (ctx) {
        const s = window.getSelection();
        selRangeRef.current = s && s.rangeCount > 0 ? s.getRangeAt(0).cloneRange() : null;
        setSel(ctx);
        setComposing(false);
      } else if (!composing) {
        setSel(null);
        selRangeRef.current = null;
      }
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, [canComment, composing]);

  // click-outside dismissal for the composer card
  useEffect(() => {
    if (!composing) return;
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(".cmt-composer-card, .cmt-margin-icon")) return;
      setComposing(false);
      setSel(null);
      selRangeRef.current = null;
    };
    const t = setTimeout(() => document.addEventListener("mousedown", onClick), 150);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", onClick); };
  }, [composing]);

  // temporary blue highlight on the selected text while composing
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const clearTemp = () => {
      root.querySelectorAll<HTMLElement>("mark.cmt-composing-highlight").forEach((m) => {
        const parent = m.parentNode;
        if (!parent) return;
        while (m.firstChild) parent.insertBefore(m.firstChild, m);
        parent.removeChild(m);
        parent.normalize();
      });
    };
    if (composing && selRangeRef.current) {
      try {
        const mark = document.createElement("mark");
        mark.className = "cmt-composing-highlight";
        selRangeRef.current.surroundContents(mark);
        window.getSelection()?.removeAllRanges();
      } catch { /* cross-boundary selection — skip temp highlight */ }
    }
    return clearTemp;
  }, [composing]);

  const submitInline = async () => {
    if (!sel || !draft.trim() || !onAddInline) return;
    setBusy(true);
    try {
      await onAddInline({
        quote: sel.quote,
        prefix: sel.prefix,
        suffix: sel.suffix,
        anchor: sel.anchor,
        text: draft.trim(),
      });
      setDraft("");
      setSel(null);
      setComposing(false);
      selRangeRef.current = null;
      window.getSelection()?.removeAllRanges();
    } finally {
      setBusy(false);
    }
  };

  // Scroll + flash on navigation (runs after the memoized body is committed).
  useEffect(() => {
    if (!navTarget || !containerRef.current) return;
    const root = containerRef.current;
    const run = () => {
      let el: HTMLElement | null = null;
      if (navTarget.idTarget) {
        el = root.querySelector(`mark[data-comment-id="${navTarget.idTarget}"]`);
        if (!el) el = findIdElement(root, navTarget.idTarget);
      }
      if (!el && navTarget.anchor)
        el = root.querySelector(`#${CSS.escape(navTarget.anchor)}`);
      if (el) flash(el);
      else root.parentElement?.scrollTo({ top: 0 });
    };
    const t = setTimeout(run, 80);
    return () => clearTimeout(t);
  }, [navTarget?.nonce, content]);

  // compute margin position for the comment icon and card
  const marginPos = (() => {
    const root = containerRef.current;
    if (!root || !sel) return null;
    const rootRect = root.getBoundingClientRect();
    const gap = 16;
    const cardW = 280;
    const rightSpace = window.innerWidth - rootRect.right;
    const useMargin = rightSpace > cardW + gap * 2;
    return {
      iconLeft: useMargin ? rootRect.right + gap : rootRect.right - 48,
      iconTop: Math.max(64, (sel.rect.top + sel.rect.bottom) / 2 - 18),
      cardLeft: useMargin
        ? rootRect.right + gap
        : Math.max(gap, window.innerWidth - cardW - gap * 2),
      cardTop: Math.max(64, Math.min(sel.rect.top - 8, window.innerHeight - 380)),
    };
  })();

  const dismissComposer = () => {
    setComposing(false);
    setSel(null);
    selRangeRef.current = null;
  };

  return (
    <div className="prose-srs" ref={containerRef} style={{ position: "relative" }}>
      <MarkdownBody
        content={content}
        wireframeImages={wireframeImages}
        onCrossLink={onCrossLink}
        onSearchRef={onSearchRef}
      />

      {/* Google Docs-style margin comment icon */}
      {sel && !composing && marginPos && (
        <div
          className="cmt-margin-icon"
          style={{ left: marginPos.iconLeft, top: marginPos.iconTop }}
        >
          <button
            title="Add comment"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setComposing(true);
              setDraft("");
            }}
          >
            <IconMessagePlus size={18} />
          </button>
        </div>
      )}

      {/* Google Docs-style margin composer card */}
      {sel && composing && marginPos && (
        <Paper
          withBorder
          shadow="lg"
          p="sm"
          radius="md"
          className="cmt-composer-card"
          style={{ left: marginPos.cardLeft, top: marginPos.cardTop }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Text size="xs" c="dimmed" lineClamp={2} fs="italic" className="cmt-quote-bar">
            {sel.quote}
          </Text>
          <Textarea
            data-autofocus
            autoFocus
            autosize
            minRows={2}
            maxRows={6}
            placeholder="Add a comment…"
            value={draft}
            onChange={(e) => setDraft(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitInline();
              if (e.key === "Escape") dismissComposer();
            }}
            styles={{ input: { fontSize: 13 } }}
          />
          <Group justify="flex-end" gap="xs" mt={8}>
            <Button size="xs" variant="subtle" color="gray" onClick={dismissComposer}>
              Cancel
            </Button>
            <Button size="xs" loading={busy} disabled={!draft.trim()} onClick={submitInline}>
              Comment
            </Button>
          </Group>
          <Text size="xs" c="dimmed" mt={4} ta="right">
            {navigator.platform?.includes?.("Mac") ? "\u2318" : "Ctrl"}+Enter to submit
          </Text>
        </Paper>
      )}
    </div>
  );
}
