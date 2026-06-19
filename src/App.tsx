import { useCallback, useEffect, useRef, useState } from "react";
import FileTree from "./components/FileTree";
import MarkdownView from "./components/MarkdownView";
import EditorPane from "./components/EditorPane";
import LoginModal from "./components/LoginModal";
import ChatPanel from "./components/ChatPanel";
import SearchBar from "./components/SearchBar";
import RequirementExplorer from "./components/RequirementExplorer";
import {
  fetchConfig,
  fetchTree,
  fetchFile,
  lookupId,
  search,
  saveFile,
  login,
  fetchWireframeImages,
} from "./api";
import type {
  TreeNode,
  NavTarget,
  ChatSource,
  SearchHit,
  Product,
  FileCommit,
} from "./types";

type View = "doc" | "explorer";
type MobileTab = "tree" | "doc" | "chat";

const TOKEN_KEY = "srs_edit_token";

// pick the first markdown file in a tree (depth-first), preferring Part 4
function firstFile(nodes: TreeNode[]): string | null {
  let fallback: string | null = null;
  const walk = (ns: TreeNode[]): string | null => {
    for (const n of ns) {
      if (n.type === "file" && n.path) {
        if (!fallback) fallback = n.path;
        if (/Part_4_Functional/.test(n.path)) return n.path;
      } else if (n.children) {
        const hit = walk(n.children);
        if (hit) return hit;
      }
    }
    return null;
  };
  return walk(nodes) || fallback;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<string>("");
  const [editingEnabled, setEditingEnabled] = useState(false);

  const [tree, setTree] = useState<TreeNode[]>([]);
  const [path, setPath] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [history, setHistory] = useState<FileCommit[]>([]);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [navTarget, setNavTarget] = useState<NavTarget | null>(null);
  const [view, setView] = useState<View>("doc");
  const [wireframeImages, setWireframeImages] = useState<Set<string>>(new Set());

  // editing
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  );
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [leftW, setLeftW] = useState(280);
  const [rightW, setRightW] = useState(380);
  const [mobileTab, setMobileTab] = useState<MobileTab>("doc");
  const nonce = useRef(0);

  // ---- bootstrap ----
  useEffect(() => {
    fetchWireframeImages().then(setWireframeImages);
    fetchConfig().then((cfg) => {
      setProducts(cfg.products);
      setEditingEnabled(cfg.editingEnabled);
      setProduct(cfg.defaultProduct);
    });
  }, []);

  // load tree + landing doc whenever the product changes
  useEffect(() => {
    if (!product) return;
    setEditing(false);
    fetchTree(product).then((t) => {
      setTree(t);
      const f = firstFile(t);
      if (f) openFile(f);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const loadFile = useCallback(async (filePath: string) => {
    setLoadingDoc(true);
    try {
      const res = await fetchFile(filePath);
      setContent(res.content);
      setHistory(res.history || []);
      setPath(filePath);
    } catch {
      setContent(`# Could not load file\n\n\`${filePath}\``);
      setHistory([]);
      setPath(filePath);
    } finally {
      setLoadingDoc(false);
    }
  }, []);

  const openFile = useCallback(
    async (filePath: string, anchor?: string, highlight?: string, idTarget?: string) => {
      setView("doc");
      setMobileTab("doc");
      setEditing(false);
      if (filePath !== path) await loadFile(filePath);
      nonce.current += 1;
      setNavTarget({ filePath, anchor, highlight, idTarget, nonce: nonce.current });
    },
    [path, loadFile]
  );

  const handleCrossLink = useCallback(
    async (id: string) => {
      const r = await lookupId(id, product);
      if (r) openFile(r.filePath, r.headingAnchor, id, id);
      else {
        const hits = await search(id, product);
        if (hits[0]) openFile(hits[0].filePath, hits[0].headingAnchor, id, id);
      }
    },
    [openFile, product]
  );

  const handleSearchRef = useCallback(
    async (text: string) => {
      const hits = await search(text, product);
      if (hits[0]) openFile(hits[0].filePath, hits[0].headingAnchor);
    },
    [openFile, product]
  );

  const handlePick = useCallback(
    (h: SearchHit) => openFile(h.filePath, h.headingAnchor, h.snippet),
    [openFile]
  );

  const handleSource = useCallback(
    (s: ChatSource) => openFile(s.filePath, s.headingAnchor),
    [openFile]
  );

  // ---- editing actions ----
  const startEditing = () => {
    if (!path) return;
    if (token) setEditing(true);
    else setShowLogin(true);
  };

  const doLogin = async (password: string) => {
    const t = await login(password);
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setShowLogin(false);
    setEditing(true);
  };

  const handleSave = async (newContent: string) => {
    if (!path || !token) return;
    setSaving(true);
    try {
      const r = await saveFile(path, newContent, token);
      setContent(newContent);
      // refresh history after the auto-commit
      fetchFile(path).then((res) => setHistory(res.history || []));
      setToast(r.committed ? `Saved · committed ${r.committed}` : "Saved");
    } catch (e: any) {
      if (/author/i.test(e?.message || "")) {
        // token expired → re-auth
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setEditing(false);
        setShowLogin(true);
      }
      setToast(e?.message || "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const startDrag = (side: "left" | "right") => (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startLeft = leftW;
    const startRight = rightW;
    const move = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      if (side === "left") setLeftW(Math.min(480, Math.max(180, startLeft + dx)));
      else setRightW(Math.min(620, Math.max(260, startRight - dx)));
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const currentProduct = products.find((p) => p.id === product);

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center gap-3 px-3 py-2 border-b border-slate-200 bg-white shrink-0">
        <div className="font-extrabold text-sm whitespace-nowrap">
          SRS <span className="text-indigo-600">Knowledge Base</span>
        </div>

        {/* product selector */}
        <select
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="text-xs border border-slate-300 rounded px-2 py-1 bg-white max-w-[180px]"
          title="Switch product"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="hidden md:flex gap-1">
          <button
            onClick={() => setView("doc")}
            className={`text-xs px-2 py-1 rounded ${
              view === "doc" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setView("explorer")}
            className={`text-xs px-2 py-1 rounded ${
              view === "explorer" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Requirements
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <SearchBar product={product} onPick={handlePick} />
        </div>

        {/* edit controls */}
        {editingEnabled && view === "doc" && !editing && (
          <button
            onClick={startEditing}
            disabled={!path}
            className="text-xs border border-slate-300 px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40"
            title={token ? "Edit this document" : "Unlock editing"}
          >
            {token ? "✎ Edit" : "🔒 Edit"}
          </button>
        )}
      </header>

      <div className="md:hidden flex border-b border-slate-200 bg-white text-xs shrink-0">
        {(["tree", "doc", "chat"] as MobileTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setMobileTab(t)}
            className={`flex-1 py-2 ${
              mobileTab === t ? "border-b-2 border-indigo-600 font-semibold" : "text-slate-500"
            }`}
          >
            {t === "tree" ? "Files" : t === "doc" ? "Document" : "Chat"}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <aside
          className={`border-r border-slate-200 overflow-auto bg-slate-50 shrink-0 ${
            mobileTab === "tree" ? "block w-full" : "hidden"
          } md:block`}
          style={{ width: window.innerWidth >= 768 ? leftW : undefined }}
        >
          <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
            {currentProduct?.name || "Documents"}
          </div>
          <FileTree tree={tree} activePath={path} onOpen={openFile} />
        </aside>

        <div
          onMouseDown={startDrag("left")}
          className="hidden md:block w-1 cursor-col-resize hover:bg-indigo-200 shrink-0"
        />

        <main
          className={`flex-1 overflow-hidden bg-white flex flex-col ${
            mobileTab === "doc" ? "block" : "hidden"
          } md:flex`}
        >
          {view === "explorer" ? (
            <div className="flex-1 overflow-hidden">
              <RequirementExplorer
                product={product}
                onOpenId={handleCrossLink}
                onOpenTestCase={handleCrossLink}
              />
            </div>
          ) : editing && path ? (
            <EditorPane
              filePath={path}
              initialContent={content}
              wireframeImages={wireframeImages}
              saving={saving}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <div className="flex-1 overflow-auto">
              <div className="max-w-4xl mx-auto px-6 py-5">
                {loadingDoc ? (
                  <div className="text-slate-400 text-sm">Loading…</div>
                ) : (
                  <>
                    <MarkdownView
                      content={content}
                      filePath={path || ""}
                      navTarget={navTarget}
                      wireframeImages={wireframeImages}
                      onCrossLink={handleCrossLink}
                      onSearchRef={handleSearchRef}
                    />
                    {history.length > 0 && (
                      <div className="mt-8 pt-3 border-t border-slate-200 text-[11px] text-slate-400">
                        <span className="font-semibold">Recent edits:</span>{" "}
                        {history.slice(0, 5).map((h) => (
                          <span key={h.hash} className="mr-3">
                            {h.date} {h.subject} ({h.hash})
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </main>

        <div
          onMouseDown={startDrag("right")}
          className="hidden md:block w-1 cursor-col-resize hover:bg-indigo-200 shrink-0"
        />

        <aside
          className={`border-l border-slate-200 bg-white shrink-0 ${
            mobileTab === "chat" ? "block w-full" : "hidden"
          } md:block`}
          style={{ width: window.innerWidth >= 768 ? rightW : undefined }}
        >
          <ChatPanel
            product={product}
            onCrossLink={handleCrossLink}
            onSource={handleSource}
          />
        </aside>
      </div>

      {showLogin && (
        <LoginModal onSubmit={doLogin} onClose={() => setShowLogin(false)} />
      )}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
