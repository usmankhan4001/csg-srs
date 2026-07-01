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
  useMantineColorScheme,
  useComputedColorScheme,
  Burger,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
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
  IconHistory,
  IconCloudUpload,
  IconSun,
  IconMoon,
  IconHelp,
  IconCloudCheck,
} from "@tabler/icons-react";
import { useOnline } from "./useOnline";
import UserAuthModal from "./components/UserAuthModal";
import EditorPasswordModal from "./components/EditorPasswordModal";
import CommentsDrawer from "./components/CommentsDrawer";
import HistoryModal from "./components/HistoryModal";
import WalkthroughModal from "./components/WalkthroughModal";
import InstallPrompt from "./components/InstallPrompt";
import {
  getUser,
  logout,
  promote,
  syncQueue,
  pendingCount,
  fetchComments,
  addComment,
  type CurrentUser,
  type CommentT,
} from "./commentsClient";
import FileTree from "./components/FileTree";
import MarkdownView from "./components/MarkdownView";
import EditorPane from "./components/EditorPane";
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
  lockFile,
  unlockFile,
  fetchWireframeImages,
  prefetchProduct,
  isProductCached,
} from "./api";
import type {
  TreeNode,
  NavTarget,
  ChatSource,
  SearchHit,
  Product,
  FileCommit,
  FileLock,
} from "./types";

type View = "doc" | "explorer";

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
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<string>("");
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [offlineReady, setOfflineReady] = useState<Set<string>>(new Set());

  const [tree, setTree] = useState<TreeNode[]>([]);
  const [path, setPath] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [history, setHistory] = useState<FileCommit[]>([]);
  const [lock, setLock] = useState<FileLock | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [navTarget, setNavTarget] = useState<NavTarget | null>(null);
  const [view, setView] = useState<View>("doc");
  const [wireframeImages, setWireframeImages] = useState<Set<string>>(new Set());

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPromote, setShowPromote] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  // Auto-show the walkthrough once per browser, on first visit.
  useEffect(() => {
    if (!localStorage.getItem("srs_walkthrough_seen")) {
      setShowWalkthrough(true);
      localStorage.setItem("srs_walkthrough_seen", "1");
    }
  }, []);

  const isMobile = useMediaQuery("(max-width: 48em)");
  const [navOpened, { toggle: toggleNav, close: closeNav, open: openNav }] = useDisclosure(!isMobile);
  const [aiOpen, setAiOpen] = useState(!isMobile);
  const online = useOnline();
  const nonce = useRef(0);

  // useMediaQuery's initial value defaults to `false` and only resolves to
  // the real viewport a tick after mount, so this effect necessarily fires
  // once with a possibly-wrong guess before correcting itself on the next
  // render once the real match comes in. It only re-fires on an actual
  // isMobile transition (e.g. rotating a tablet), so manual nav/AI toggles
  // in between are left alone.
  useEffect(() => {
    if (isMobile) {
      closeNav();
      setAiOpen(false);
    } else {
      openNav();
      setAiOpen(true);
    }
  }, [isMobile, closeNav, openNav]);

  // users + comments
  const [user, setUser] = useState<CurrentUser | null>(() => getUser());
  const [showAuth, setShowAuth] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentFocus, setCommentFocus] = useState<string | null>(null);
  const [fileComments, setFileComments] = useState<CommentT[]>([]);
  const [pending, setPending] = useState(0);

  const refreshComments = useCallback(() => {
    if (path) fetchComments(path).then(setFileComments);
    else setFileComments([]);
    setPending(pendingCount());
  }, [path]);

  useEffect(() => {
    refreshComments();
  }, [path, refreshComments]);

  // sync queued offline comments when connectivity returns
  useEffect(() => {
    if (online && user) {
      syncQueue().then((n) => {
        setPending(pendingCount());
        if (n > 0) {
          notifications.show({ color: "olive", message: `Synced ${n} offline comment(s)` });
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
      notifications.show({ color: "olive", message: "Comment added" });
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

      // Check which products are already available offline, then warm up the
      // rest in the background (one at a time) so switching products later
      // works offline too — not just the one the user happened to open.
      (async () => {
        const ready = new Set<string>();
        for (const p of cfg.products) {
          if (await isProductCached(p.id)) ready.add(p.id);
        }
        setOfflineReady(new Set(ready));
        if (!navigator.onLine) return;
        for (const p of cfg.products) {
          if (ready.has(p.id)) continue;
          if (await prefetchProduct(p.id)) {
            setOfflineReady((s) => new Set(s).add(p.id));
          }
        }
      })();
    });
  }, []);

  useEffect(() => {
    if (!product) return;
    setEditing(false);
    fetchTree(product)
      .then((t) => {
        setTree(t);
        setOfflineReady((s) => new Set(s).add(product));
        const f = firstFile(t);
        if (f) openFile(f);
      })
      .catch(() => {
        setTree([]);
        setPath(null);
        setContent("# Not available offline\n\nThis product hasn't been loaded on this device yet, so it isn't available offline. Reconnect and open it once to make it available offline going forward.");
        notifications.show({
          color: "orange",
          message: "That product isn't available offline yet — reconnect to load it.",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const loadFile = useCallback(async (filePath: string) => {
    setLoadingDoc(true);
    try {
      const res = await fetchFile(filePath);
      setContent(res.content);
      setHistory(res.history || []);
      setLock(res.lock || null);
      setPath(filePath);
    } catch {
      setContent(`# Could not load file\n\n\`${filePath}\``);
      setHistory([]);
      setLock(null);
      setPath(filePath);
    } finally {
      setLoadingDoc(false);
    }
  }, []);

  // release our own edit lock when leaving a file mid-edit (nav away, product
  // switch, etc.) so it doesn't sit held for the full TTL unnecessarily
  const releaseOwnLock = useCallback(
    (filePath: string | null) => {
      const user = getUser();
      if (editing && filePath && user) unlockFile(filePath, user.token);
    },
    [editing]
  );

  const openFile = useCallback(
    async (filePath: string, anchor?: string, highlight?: string, idTarget?: string) => {
      setView("doc");
      if (editing && filePath !== path) releaseOwnLock(path);
      setEditing(false);
      if (filePath !== path) await loadFile(filePath);
      nonce.current += 1;
      setNavTarget({ filePath, anchor, highlight, idTarget, nonce: nonce.current });
      if (isMobile) closeNav();
    },
    [path, loadFile, editing, releaseOwnLock, isMobile, closeNav]
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

  // Sign in -> unlock editing (enter EDIT_PASSWORD once) -> acquire the file
  // lock -> enter edit mode. Each step short-circuits to the right prompt.
  const startEditing = async () => {
    if (!path) return;
    const currentUser = getUser(); // avoid stale closure right after sign-in/promote
    if (!currentUser) {
      setShowAuth(true);
      return;
    }
    if (currentUser.role !== "editor") {
      setShowPromote(true);
      return;
    }
    const r = await lockFile(path, currentUser.token);
    if (!r.ok) {
      setLock(r.lock || null);
      notifications.show({ color: "orange", message: r.error || "This document is locked." });
      return;
    }
    setLock(r.lock || null);
    setEditing(true);
  };

  const doPromote = async (password: string) => {
    await promote(password);
    setUser(getUser());
    setShowPromote(false);
    // re-run startEditing now that the account is an editor
    await startEditing();
  };

  const stopEditing = () => {
    releaseOwnLock(path);
    setEditing(false);
    setLock(null);
  };

  // renew the lock periodically while the editor stays open, well inside the
  // 5-minute server-side TTL, so a long editing session never expires under
  // the user's feet
  useEffect(() => {
    if (!editing || !path) return;
    const t = setInterval(() => {
      const u = getUser();
      if (u) lockFile(path, u.token).catch(() => {});
    }, 90_000);
    return () => clearInterval(t);
  }, [editing, path]);

  // release the lock if the tab closes while still editing (best-effort)
  useEffect(() => {
    const handler = () => releaseOwnLock(path);
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [path, releaseOwnLock]);

  const handleSave = async (newContent: string) => {
    const user = getUser();
    if (!path || !user) return;
    setSaving(true);
    try {
      const r = await saveFile(path, newContent, user.token);
      setContent(newContent);
      fetchFile(path).then((res) => {
        setHistory(res.history || []);
        setLock(res.lock || null);
      });
      notifications.show({
        color: "olive",
        message: r.committed ? `Saved · committed ${r.committed}` : "Saved",
      });
    } catch (e: any) {
      const msg = e?.message || "Save failed";
      if (/currently editing/i.test(msg)) {
        // someone else grabbed the lock (e.g. ours expired) — bail to read-only
        setEditing(false);
        fetchFile(path).then((res) => setLock(res.lock || null));
      } else if (/sign in|not an editor/i.test(msg)) {
        setEditing(false);
        setShowAuth(true);
      }
      notifications.show({ color: "red", message: msg });
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
          <Burger opened={navOpened} onClick={toggleNav} hiddenFrom="sm" size="sm" />
          <Title order={5} style={{ whiteSpace: "nowrap" }}>
            SRS{" "}
            <Text span c="olive.6" inherit>
              Knowledge Base
            </Text>
          </Title>

          <Select
            size="xs"
            value={product}
            onChange={(v) => v && setProduct(v)}
            data={products.map((p) => ({
              value: p.id,
              label: p.name,
              disabled: !online && !offlineReady.has(p.id),
            }))}
            renderOption={({ option, checked }) => (
              <Group flex="1" gap="xs" justify="space-between" wrap="nowrap">
                <Text size="sm">{option.label}</Text>
                {offlineReady.has(option.value) && !checked && (
                  <Tooltip label="Available offline">
                    <IconCloudCheck size={13} style={{ opacity: 0.5, flexShrink: 0 }} />
                  </Tooltip>
                )}
              </Group>
            )}
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

          {pending > 0 && (
            <Tooltip label={`${pending} comment(s) saved offline — will sync automatically once you're back online`}>
              <Badge color="blue" variant="light" leftSection={<IconCloudUpload size={12} />}>
                {pending} pending
              </Badge>
            </Tooltip>
          )}

          {editingEnabled &&
            view === "doc" &&
            !editing &&
            online &&
            (lock && lock.username !== user?.username ? (
              <Tooltip label={`${lock.displayName} is currently editing this document`}>
                <Badge color="orange" variant="light" leftSection={<IconLock size={12} />}>
                  {lock.displayName} editing
                </Badge>
              </Tooltip>
            ) : (
              <Tooltip label={user?.role === "editor" ? "Edit document" : "Unlock editing"}>
                <Button
                  size="xs"
                  variant="light"
                  leftSection={
                    user?.role === "editor" ? <IconPencil size={14} /> : <IconLock size={14} />
                  }
                  onClick={startEditing}
                  disabled={!path}
                >
                  Edit
                </Button>
              </Tooltip>
            ))}

          {view === "doc" && path && history.length > 0 && (
            <Tooltip label="Version history">
              <ActionIcon
                variant="default"
                onClick={() => setShowHistory(true)}
                aria-label="Version history"
              >
                <IconHistory size={18} />
              </ActionIcon>
            </Tooltip>
          )}

          <Tooltip label="Comments">
            <Indicator
              disabled={fileComments.length === 0}
              label={fileComments.length}
              size={16}
              color="olive"
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

          <Tooltip label="How to use this app">
            <ActionIcon
              variant="default"
              onClick={() => setShowWalkthrough(true)}
              aria-label="How to use this app"
            >
              <IconHelp size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={computedColorScheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <ActionIcon
              variant="default"
              onClick={() => setColorScheme(computedColorScheme === "dark" ? "light" : "dark")}
              aria-label="Toggle color scheme"
            >
              {computedColorScheme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
          </Tooltip>

          {user ? (
            <Menu shadow="md" width={180} position="bottom-end">
              <Menu.Target>
                <Tooltip label={user.displayName}>
                  <Avatar color="olive" radius="xl" size={30} style={{ cursor: "pointer" }}>
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
            onCancel={stopEditing}
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
                    <Text
                      size="xs"
                      c="dimmed"
                      mt="xl"
                      pt="sm"
                      style={{ borderTop: "1px solid var(--mantine-color-gray-3)", cursor: "pointer" }}
                      onClick={() => setShowHistory(true)}
                    >
                      <b>Last edited:</b> {history[0].date} by {history[0].author} ({history[0].hash})
                      {history.length > 1 && ` · ${history.length} revisions — view history`}
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

      <EditorPasswordModal
        opened={showPromote}
        onSubmit={doPromote}
        onClose={() => setShowPromote(false)}
      />
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
      <HistoryModal
        opened={showHistory}
        onClose={() => setShowHistory(false)}
        filePath={path || ""}
        history={history}
        currentContent={content}
        onRestored={(restoredContent) => {
          setContent(restoredContent);
          if (path)
            fetchFile(path).then((res) => {
              setHistory(res.history || []);
              setLock(res.lock || null);
            });
          notifications.show({ color: "olive", message: "Restored earlier version" });
        }}
      />
      <InstallPrompt />
      <WalkthroughModal
        opened={showWalkthrough}
        onClose={() => setShowWalkthrough(false)}
      />
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
