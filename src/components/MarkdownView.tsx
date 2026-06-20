import { useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Mermaid from "./Mermaid";
import { rehypeCrossLinks } from "../crosslink";
import { slugify, nodeText, SCR_RE } from "../util";
import type { NavTarget } from "../types";

interface Props {
  content: string;
  filePath: string;
  navTarget: NavTarget | null;
  wireframeImages: Set<string>;
  commentCounts?: Map<string, number>;
  onAnchorComment?: (anchor: string) => void;
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
  commentCounts,
  onAnchorComment,
  onCrossLink,
  onSearchRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Decorate headings with inline comment markers.
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !onAnchorComment) return;
    root.querySelectorAll(".cmt-marker").forEach((e) => e.remove());
    root.querySelectorAll<HTMLElement>("h1[id],h2[id],h3[id],h4[id]").forEach((h) => {
      const anchor = h.id;
      const n = commentCounts?.get(anchor) || 0;
      const btn = document.createElement("button");
      btn.className = "cmt-marker" + (n ? " has" : "");
      btn.textContent = n ? `💬 ${n}` : "💬";
      btn.title = n ? `${n} comment(s) — click to view` : "Add a comment here";
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAnchorComment(anchor);
      };
      h.appendChild(btn);
    });
  }, [content, commentCounts, onAnchorComment]);

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

  return (
    <div className="prose-srs" ref={containerRef}>
      <MarkdownBody
        content={content}
        wireframeImages={wireframeImages}
        onCrossLink={onCrossLink}
        onSearchRef={onSearchRef}
      />
    </div>
  );
}
