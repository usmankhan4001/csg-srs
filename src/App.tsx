import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppShell,
  Group,
  Title,
  Select,
  SegmentedControl,
  Button,
  ActionIcon,
  Tooltip,
  Text,
  Loader,
  Box,
  ScrollArea,
  Badge,
  Menu,
  Avatar,
  Indicator,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconPencil,
  IconLock,
  IconMessage,
  IconMessageOff,
  IconFileText,
  IconTable,
  IconWifiOff,
  IconMessageCircle,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import { useOnline } from "./useOnline";
import UserAuthModal from "./components/UserAuthModal";
import CommentsDrawer from "./components/CommentsDrawer";
import InstallPrompt from "./components/InstallPrompt";
import {
  getUser,
  logout,
  syncQueue,
  fetchComments,
  addComment,
  type CurrentUser,
  type CommentT,
} from "./commentsClient";
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
const TOKEN_KEY = "srs_edit_token";

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

  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [navOpened, { toggle: toggleNav }] = useDisclosure(true);
  const [aiOpen, setAiOpen] = useState(true);
  const online = useOnline();
  const nonce = useRef(0);

  // users + comments
  const [user, setUser] = useState<CurrentUser | null>(() => getUser());
  const [showAuth, setShowAuth] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentFocus, setCommentFocus] = useState<string | null>(null);
  const [fileComments, setFileComments] = useState<CommentT[]>([]);

  const refreshComments = useCallback(() => {
    if (path) fetchComments(path).then(setFileComments);
    else setFileComments([]);
  }, [path]);

  useEffect(() => {
    refreshComments();
  }, [path, refreshComments]);

  // sync queued offline comments when connectivity returns
  useEffect(() => {
    if (online && user) {
      syncQueue().then((n) => {
        if (n > 0) {
          notifications.show({ color: "teal", message: `Synced ${n} offline comment(s)` });
          refreshComments();
        }
      });
    }
  }, [online, user, refreshComments]);

  // add an inline (text-selection) comment
  const addInlineComment = useCallback(
    async (p: { quote: string; prefix: string; suffix: string; anchor: string; text: string }) => {
      if (!getUser()) {
        setShowAuth(true);
        return;
      }
      if (!path) return;
      await addComment({ product, filePath: path, ...p });
      refreshComments();
      notifications.show({ color: "teal", message: "Comment added" });
    },
    [path, product, refreshComments]
  );

  const openCommentThread = useCallback((id: string) => {
    setCommentFocus(id);
    setCommentsOpen(true);
  }, []);

  useEffect(() => {
    fetchWireframeImages().then(setWireframeImages);
    fetchConfig().then((cfg) => {
      setProducts(cfg.products);
      setEditingEnabled(cfg.editingEnabled);
      setProduct(cfg.defaultProduct);
    });
  }, []);

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
      fetchFile(path).then((res) => setHistory(res.history || []));
      notifications.show({
        color: "teal",
        message: r.committed ? `Saved · committed ${r.committed}` : "Saved",
      });
    } catch (e: any) {
      if (/author|expired|not authorized/i.test(e?.message || "")) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setEditing(false);
        setShowLogin(true);
      }
      notifications.show({ color: "red", message: e?.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const currentProduct = products.find((p) => p.id === product);

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !navOpened } }}
      aside={{
        width: 400,
        breakpoint: "md",
        collapsed: { desktop: !aiOpen, mobile: !aiOpen },
      }}
      padding={0}
    >
      <AppShell.Header>
        <Group h="100%" px="sm" gap="sm" wrap="nowrap">
          <Title order={5} style={{ whiteSpace: "nowrap" }}>
            SRS{" "}
            <Text span c="indigo.6" inherit>
              Knowledge Base
            </Text>
          </Title>

          <Select
            size="xs"
            value={product}
            onChange={(v) => v && setProduct(v)}
            data={products.map((p) => ({ value: p.id, label: p.name }))}
            allowDeselect={false}
            w={170}
            visibleFrom="sm"
          />

          <SegmentedControl
            size="xs"
            value={view}
            onChange={(v) => setView(v as View)}
            data={[
              { value: "doc", label: <Center icon={<IconFileText size={14} />} label="Docs" /> },
              { value: "explorer", label: <Center icon={<IconTable size={14} />} label="Requirements" /> },
            ]}
            visibleFrom="sm"
          />

          <Box style={{ flex: 1 }} maw={560} mx="auto">
            <SearchBar product={product} onPick={handlePick} />
          </Box>

          {!online && (
            <Tooltip label="Offline — viewing cached docs. AI is unavailable.">
              <Badge color="orange" variant="light" leftSection={<IconWifiOff size={12} />}>
                Offline
              </Badge>
            </Tooltip>
          )}

          {editingEnabled && view === "doc" && !editing && online && (
            <Tooltip label={token ? "Edit document" : "Unlock editing"}>
              <Button
                size="xs"
                variant="light"
                leftSection={token ? <IconPencil size={14} /> : <IconLock size={14} />}
                onClick={startEditing}
                disabled={!path}
              >
                Edit
              </Button>
            </Tooltip>
          )}

          <Tooltip label="Comments">
            <Indicator
              disabled={fileComments.length === 0}
              label={fileComments.length}
              size={16}
              color="indigo"
            >
              <ActionIcon
                variant={commentsOpen ? "filled" : "default"}
                onClick={() => {
                  setCommentFocus(null);
                  setCommentsOpen(true);
                }}
                aria-label="Comments"
                disabled={view !== "doc" || !path}
              >
                <IconMessageCircle size={18} />
              </ActionIcon>
            </Indicator>
          </Tooltip>

          {online && (
            <Tooltip label={aiOpen ? "Hide AI assistant" : "Show AI assistant"}>
              <ActionIcon
                variant={aiOpen ? "filled" : "default"}
                onClick={() => setAiOpen((o) => !o)}
                aria-label="Toggle AI assistant"
              >
                {aiOpen ? <IconMessage size={18} /> : <IconMessageOff size={18} />}
              </ActionIcon>
            </Tooltip>
          )}

          {user ? (
            <Menu shadow="md" width={180} position="bottom-end">
              <Menu.Target>
                <Tooltip label={user.displayName}>
                  <Avatar color="indigo" radius="xl" size={30} style={{ cursor: "pointer" }}>
                    {user.displayName.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                  </Avatar>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{user.displayName}</Menu.Label>
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  onClick={() => {
                    logout();
                    setUser(null);
                  }}
                >
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button
              size="xs"
              variant="default"
              leftSection={<IconUser size={14} />}
              onClick={() => setShowAuth(true)}
            >
              Sign in
            </Button>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="xs">
        <Group justify="space-between" mb="xs" px="xs">
          <Text size="xs" fw={700} c="dimmed" tt="uppercase">
            {currentProduct?.name || "Documents"}
          </Text>
          <Badge size="xs" variant="light" color="gray" hiddenFrom="sm" onClick={toggleNav}>
            close
          </Badge>
        </Group>
        <ScrollArea style={{ flex: 1 }} type="hover">
          <FileTree tree={tree} activePath={path} onOpen={openFile} />
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main h="calc(100dvh - 56px)">
        {view === "explorer" ? (
          <RequirementExplorer
            product={product}
            onOpenId={handleCrossLink}
            onOpenTestCase={handleCrossLink}
          />
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
          <ScrollArea h="100%" type="auto">
            <Box maw={900} mx="auto" px="xl" py="lg">
              {loadingDoc ? (
                <Group gap="xs" c="dimmed">
                  <Loader size="xs" /> <Text size="sm">Loading…</Text>
                </Group>
              ) : (
                <>
                  <MarkdownView
                    content={content}
                    filePath={path || ""}
                    navTarget={navTarget}
                    wireframeImages={wireframeImages}
                    comments={fileComments}
                    canComment
                    onAddInline={addInlineComment}
                    onOpenComment={openCommentThread}
                    onCrossLink={handleCrossLink}
                    onSearchRef={handleSearchRef}
                  />
                  {history.length > 0 && (
                    <Text size="xs" c="dimmed" mt="xl" pt="sm" style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}>
                      <b>Recent edits:</b>{" "}
                      {history.slice(0, 5).map((h) => (
                        <span key={h.hash} style={{ marginRight: 12 }}>
                          {h.date} {h.subject} ({h.hash})
                        </span>
                      ))}
                    </Text>
                  )}
                </>
              )}
            </Box>
          </ScrollArea>
        )}
      </AppShell.Main>

      <AppShell.Aside p={0}>
        <ChatPanel
          product={product}
          online={online}
          onCrossLink={handleCrossLink}
          onSource={handleSource}
        />
      </AppShell.Aside>

      <LoginModal opened={showLogin} onSubmit={doLogin} onClose={() => setShowLogin(false)} />
      <UserAuthModal
        opened={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthed={() => setUser(getUser())}
      />
      <CommentsDrawer
        opened={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        product={product}
        filePath={path || ""}
        content={content}
        focusCommentId={commentFocus}
        online={online}
        hasUser={!!user}
        onRequireAuth={() => setShowAuth(true)}
        onNavigate={(a, idTarget) => path && openFile(path, a || undefined, undefined, idTarget)}
        onChanged={refreshComments}
      />
      <InstallPrompt />
    </AppShell>
  );
}

// small helper for segmented-control labels
function Center({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Group gap={6} wrap="nowrap">
      {icon}
      <span>{label}</span>
    </Group>
  );
}
