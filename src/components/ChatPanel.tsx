import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { rehypeCrossLinks } from "../crosslink";
import type { ChatSource } from "../types";

interface Msg {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  error?: string;
}

const isTableRow = (l: string) => /^\s*\|.*\|\s*$/.test(l);
const isSeparator = (l: string) => /^\s*\|?\s*:?-{2,}/.test(l) && /-/.test(l);

// Safety net: repair GFM tables the model may emit without a blank line before
// them or without the |---| separator row, so they render instead of leaking "|".
function fixMarkdownTables(src: string): string {
  const lines = src.split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prev = out.length ? out[out.length - 1] : "";
    if (isTableRow(line) && !isTableRow(prev) && !isSeparator(line)) {
      // ensure a blank line before a table starts
      if (prev.trim() !== "") out.push("");
      out.push(line);
      // if the next line isn't a separator, synthesize one from the header
      const next = lines[i + 1] ?? "";
      if (!isSeparator(next)) {
        const cols = line.split("|").filter((_, idx, arr) =>
          idx !== 0 && idx !== arr.length - 1 ? true : false
        ).length;
        if (cols > 0) out.push("| " + Array(cols).fill("---").join(" | ") + " |");
      }
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

export default function ChatPanel({
  product,
  online,
  onCrossLink,
  onSource,
}: {
  product: string;
  online: boolean;
  onCrossLink: (id: string) => void;
  onSource: (s: ChatSource) => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollDown = () =>
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });

  async function sendMessage() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [
      ...m,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ]);
    setBusy(true);
    scrollDown();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, product }),
      });
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      // Pure updater — replaces the last message with a new object. Mutating
      // it in place would double-apply under React StrictMode (updaters run
      // twice), duplicating every streamed delta.
      const patchLast = (patch: Partial<Msg>) =>
        setMessages((all) =>
          all.map((m, i) =>
            i === all.length - 1 ? { ...m, ...patch } : m
          )
        );

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() || "";
        for (const evt of events) {
          const ev = /event: (.+)/.exec(evt)?.[1];
          const dataLine = /data: (.+)/.exec(evt)?.[1];
          if (!ev || !dataLine) continue;
          const data = JSON.parse(dataLine);
          if (ev === "sources") patchLast({ sources: data });
          else if (ev === "delta") {
            const text = data.text as string;
            setMessages((all) =>
              all.map((m, i) =>
                i === all.length - 1 ? { ...m, content: m.content + text } : m
              )
            );
            scrollDown();
          } else if (ev === "error") patchLast({ error: data.message });
        }
      }
    } catch (e: any) {
      setMessages((all) =>
        all.map((m, i) =>
          i === all.length - 1
            ? { ...m, error: e?.message || "Request failed" }
            : m
        )
      );
    } finally {
      setBusy(false);
      scrollDown();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1b1e]">
        <div className="font-semibold text-sm dark:text-slate-100">SRS Assistant</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Answers strictly from the SRS, with citations
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <p>Try asking:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>What is LMS-FR-057?</li>
              <li>What is the total project budget?</li>
              <li>What are the HIGH risk items?</li>
              <li>Why was AWS chosen over OCI?</li>
            </ul>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i}>
            <div
              className={`text-[10px] uppercase tracking-wide mb-1 ${
                m.role === "user" ? "text-teal-700 dark:text-teal-400" : "text-slate-400"
              }`}
            >
              {m.role === "user" ? "You" : "Assistant"}
            </div>
            <div
              className={`rounded-lg px-3 py-2 text-[13.5px] ${
                m.role === "user"
                  ? "bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-100"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              }`}
            >
              {m.role === "assistant" ? (
                busy && i === messages.length - 1 ? (
                  // While streaming, show plain text — re-parsing markdown on
                  // every delta corrupts partial tables. Render markdown only
                  // once the message is complete.
                  <div
                    className="text-[13.5px] whitespace-pre-wrap text-slate-700 dark:text-slate-200"
                    style={{ wordBreak: "break-word" }}
                  >
                    {m.content || "…"}
                  </div>
                ) : (
                  <div className="prose-srs" style={{ fontSize: 13.5 }}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeCrossLinks as any]}
                      components={{
                        a({ href, children }: any) {
                          const h = String(href || "");
                          if (h.startsWith("#xlink:"))
                            return (
                              <a
                                className="xlink"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onCrossLink(h.slice(7));
                                }}
                              >
                                {children}
                              </a>
                            );
                          return <span>{children}</span>;
                        },
                      }}
                    >
                      {fixMarkdownTables(m.content)}
                    </ReactMarkdown>
                  </div>
                )
              ) : (
                m.content
              )}
              {m.error && (
                <div className="mt-1 text-xs text-red-600">{m.error}</div>
              )}
            </div>
            {m.sources && m.sources.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {m.sources.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSource(s)}
                    className="text-[10.5px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-teal-300 rounded px-1.5 py-0.5 text-slate-600 dark:text-slate-300"
                    title={`${s.part} — ${s.heading}`}
                  >
                    {s.heading.length > 36
                      ? s.heading.slice(0, 36) + "…"
                      : s.heading}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-[#1a1b1e]">
        {!online && (
          <div className="mb-2 text-[11px] text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded px-2 py-1">
            You're offline — the AI assistant needs a connection. Docs, search,
            and comments still work.
          </div>
        )}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={2}
          disabled={!online}
          placeholder={online ? "Ask about the SRS…" : "Unavailable offline"}
          className="w-full resize-none text-sm border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:bg-slate-50 dark:disabled:bg-slate-900"
        />
        <button
          onClick={sendMessage}
          disabled={busy || !online}
          className="mt-1 w-full bg-teal-700 text-white text-sm rounded-md py-1.5 disabled:opacity-50 hover:bg-teal-800"
        >
          {busy ? "Thinking…" : "Send"}
        </button>
      </div>
    </div>
  );
}
