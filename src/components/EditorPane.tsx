import { useEffect, useRef, useState } from "react";
import MarkdownView from "./MarkdownView";

interface Props {
  filePath: string;
  initialContent: string;
  wireframeImages: Set<string>;
  saving: boolean;
  onSave: (content: string) => void;
  onCancel: () => void;
}

// Obsidian-style live editor: raw Markdown on the left, live preview on the right.
export default function EditorPane({
  filePath,
  initialContent,
  wireframeImages,
  saving,
  onSave,
  onCancel,
}: Props) {
  const [text, setText] = useState(initialContent);
  const [preview, setPreview] = useState(initialContent);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(initialContent);
    setPreview(initialContent);
  }, [initialContent, filePath]);

  // debounce the preview so typing stays smooth
  useEffect(() => {
    const t = setTimeout(() => setPreview(text), 200);
    return () => clearTimeout(t);
  }, [text]);

  const dirty = text !== initialContent;

  // Ctrl/Cmd+S to save, Tab inserts two spaces
  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      if (dirty) onSave(text);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const ta = taRef.current!;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      const next = text.slice(0, s) + "  " + text.slice(en);
      setText(next);
      requestAnimationFrame(() => (ta.selectionStart = ta.selectionEnd = s + 2));
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-amber-50 dark:bg-amber-950">
        <span className="text-[11px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          Editing
        </span>
        <span className="text-xs text-slate-600 dark:text-slate-300 truncate flex-1">{filePath}</span>
        {dirty && <span className="text-[11px] text-amber-600 dark:text-amber-400">● unsaved</span>}
        <button
          onClick={() => onSave(text)}
          disabled={!dirty || saving}
          className="text-xs bg-olive-700 text-white px-3 py-1 rounded disabled:opacity-50 hover:bg-olive-800"
        >
          {saving ? "Saving…" : "Save (⌘/Ctrl+S)"}
        </button>
        <button
          onClick={onCancel}
          className="text-xs border border-slate-300 dark:border-slate-600 dark:text-slate-200 px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Done
        </button>
      </div>

      <div className="flex-1 grid grid-cols-2 overflow-hidden">
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          className="h-full w-full resize-none p-4 font-mono text-[13px] leading-relaxed outline-none border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-slate-100"
          style={{ tabSize: 2 }}
        />
        <div className="h-full overflow-auto p-4 bg-white dark:bg-[#1a1b1e]">
          <div className="max-w-3xl">
            <MarkdownView
              content={preview}
              filePath={filePath}
              navTarget={null}
              wireframeImages={wireframeImages}
              onCrossLink={() => {}}
              onSearchRef={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
