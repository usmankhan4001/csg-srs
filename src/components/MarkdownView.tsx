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
      if ((e.target as HTMLElement)?.closest?.(".cmt-overlay")) return;
      const ctx = readSelection(root);
      if (ctx) {
        setSel(ctx);
        setComposing(false);
      } else if (!composing) {
        setSel(null);
      }
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, [canComment, composing]);

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
      if (navTarget.idTarget) el = findIdElement(root, navTarget.idTarget);
      if (!el && navTarget.anchor)
        el = root.querySelector(`#${CSS.escape(navTarget.anchor)}`);
      if (el) flash(el);
      else root.parentElement?.scrollTo({ top: 0 });
    };
    const t = setTimeout(run, 80);
    return () => clearTimeout(t);
  }, [navTarget?.nonce, content]);

  // position of the floating selection UI (viewport coords from the rect)
  const fx = sel ? Math.max(8, sel.rect.left) : 0;
  const fyTop = sel ? sel.rect.top : 0;
  const fyBottom = sel ? sel.rect.bottom : 0;

  return (
    <div className="prose-srs" ref={containerRef} style={{ position: "relative" }}>
      <MarkdownBody
        content={content}
        wireframeImages={wireframeImages}
        onCrossLink={onCrossLink}
        onSearchRef={onSearchRef}
      />

      {/* floating "Comment" button on a fresh selection */}
      {sel && !composing && (
        <div
          className="cmt-overlay"
          style={{ position: "fixed", left: fx, top: Math.max(8, fyTop - 40), zIndex: 400 }}
        >
          <Button
            size="xs"
            leftSection={<IconMessagePlus size={14} />}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setComposing(true);
              setDraft("");
            }}
          >
            Comment
          </Button>
        </div>
      )}

      {/* inline composer */}
      {sel && composing && (
        <Paper
          withBorder
          shadow="md"
          p="xs"
          className="cmt-overlay"
          style={{ position: "fixed", left: fx, top: fyBottom + 8, zIndex: 400, width: 300 }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Text size="xs" c="dimmed" lineClamp={2} mb={6} fs="italic">
            “{sel.quote}”
          </Text>
          <Textarea
            data-autofocus
            autosize
            minRows={2}
            placeholder="Add a comment…"
            value={draft}
            onChange={(e) => setDraft(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitInline();
              if (e.key === "Escape") {
                setComposing(false);
                setSel(null);
              }
            }}
          />
          <Group justify="flex-end" gap="xs" mt="xs">
            <Button
              size="xs"
              variant="default"
              onClick={() => {
                setComposing(false);
                setSel(null);
              }}
            >
              Cancel
            </Button>
            <Button size="xs" loading={busy} disabled={!draft.trim()} onClick={submitInline}>
              Comment
            </Button>
          </Group>
        </Paper>
      )}
    </div>
  );
}
