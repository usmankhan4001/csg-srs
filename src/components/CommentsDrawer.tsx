import { useEffect, useMemo, useState } from "react";
import {
  Drawer,
  Tabs,
  Stack,
  Group,
  Text,
  Textarea,
  Button,
  Select,
  Badge,
  Avatar,
  Paper,
  ScrollArea,
  Anchor,
  Divider,
} from "@mantine/core";
import { IconClockHour4 } from "@tabler/icons-react";
import { slugify } from "../util";
import {
  fetchComments,
  addComment,
  fetchLog,
  getUser,
  type CommentT,
} from "../commentsClient";

interface Props {
  opened: boolean;
  onClose: () => void;
  product: string;
  filePath: string;
  content: string;
  focusCommentId: string | null;
  online: boolean;
  hasUser: boolean;
  onRequireAuth: () => void;
  onNavigate: (anchor: string) => void;
  onChanged: () => void; // notify parent to refresh counts
}

const initials = (name: string) =>
  name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const when = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

export default function CommentsDrawer({
  opened,
  onClose,
  product,
  filePath,
  content,
  focusCommentId,
  online,
  hasUser,
  onRequireAuth,
  onNavigate,
  onChanged,
}: Props) {
  const [tab, setTab] = useState<string | null>("doc");
  const [comments, setComments] = useState<CommentT[]>([]);
  const [log, setLog] = useState<CommentT[]>([]);
  const [text, setText] = useState("");
  const [anchor, setAnchor] = useState<string>("");
  const [busy, setBusy] = useState(false);

  // headings -> section options for anchoring a comment
  const headings = useMemo(() => {
    const out: { value: string; label: string }[] = [{ value: "", label: "General (whole document)" }];
    const seen = new Set<string>([""]);
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^(#{2,3})\s+(.+)$/);
      if (!m) continue;
      const value = slugify(m[2].trim());
      if (!value || seen.has(value)) continue; // dedupe (Mantine Select needs unique values)
      seen.add(value);
      out.push({ value, label: m[2].trim() });
    }
    return out;
  }, [content]);

  const headingLabel = (a: string) =>
    headings.find((h) => h.value === a)?.label || (a ? a : "General");

  const refresh = () => {
    if (filePath) fetchComments(filePath).then(setComments);
  };

  useEffect(() => {
    if (opened) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, filePath]);

  useEffect(() => {
    if (opened && tab === "log") fetchLog(product).then(setLog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, tab, product]);

  // scroll to / flash a specific comment (e.g. clicked highlight)
  useEffect(() => {
    if (!opened || !focusCommentId) return;
    setTab("doc");
    const t = setTimeout(() => {
      const el = document.getElementById(`cmt-${focusCommentId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.remove("flash-hi");
        void el.offsetWidth;
        el.classList.add("flash-hi");
      }
    }, 250);
    return () => clearTimeout(t);
  }, [focusCommentId, opened, comments]);

  const submit = async () => {
    if (!text.trim()) return;
    if (!getUser()) {
      onRequireAuth();
      return;
    }
    setBusy(true);
    try {
      await addComment({ product, filePath, anchor, text });
      setText("");
      refresh();
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  // group comments by anchor
  const groups = useMemo(() => {
    const m = new Map<string, CommentT[]>();
    for (const c of comments) {
      const k = c.anchor || "";
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(c);
    }
    return [...m.entries()];
  }, [comments]);

  const Item = ({ c, showFile }: { c: CommentT; showFile?: boolean }) => (
    <Paper withBorder p="xs" radius="md" id={`cmt-${c.id}`}>
      <Group gap="xs" mb={4} wrap="nowrap">
        <Avatar size={24} radius="xl" color="indigo">
          {initials(c.authorName || "?")}
        </Avatar>
        <Text size="sm" fw={600}>
          {c.authorName}
        </Text>
        <Text size="xs" c="dimmed">
          {when(c.createdAt)}
        </Text>
        {c.pending && (
          <Badge size="xs" color="orange" variant="light" leftSection={<IconClockHour4 size={10} />}>
            unsynced
          </Badge>
        )}
      </Group>
      {c.quote && (
        <Text size="xs" c="dimmed" fs="italic" mb={2} lineClamp={2}>
          “{c.quote}”
        </Text>
      )}
      <Text size="sm">{c.text}</Text>
      <Anchor
        size="xs"
        mt={4}
        onClick={() => {
          onNavigate(c.anchor);
          onClose();
        }}
      >
        {showFile ? c.filePath.split("/").pop() : "→ "}
        {showFile ? " · " : ""}
        {headingLabel(c.anchor)}
      </Anchor>
    </Paper>
  );

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={420}
      title={<Text fw={700}>Comments</Text>}
    >
      <Tabs value={tab} onChange={setTab}>
        <Tabs.List grow>
          <Tabs.Tab value="doc">This document ({comments.length})</Tabs.Tab>
          <Tabs.Tab value="log">Activity log</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="doc" pt="sm">
          <Stack gap="sm">
            <Paper withBorder p="xs" radius="md">
              <Select
                size="xs"
                label="Comment on"
                data={headings}
                value={anchor}
                onChange={(v) => setAnchor(v || "")}
                searchable
                mb="xs"
              />
              <Textarea
                placeholder={hasUser ? "Add a comment…" : "Sign in to comment"}
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                autosize
                minRows={2}
              />
              <Group justify="space-between" mt="xs">
                {!online && (
                  <Text size="xs" c="orange">
                    offline — will sync later
                  </Text>
                )}
                <Button size="xs" ml="auto" loading={busy} onClick={submit} disabled={!text.trim()}>
                  Comment
                </Button>
              </Group>
            </Paper>

            <ScrollArea.Autosize mah="calc(100vh - 320px)">
              <Stack gap="md">
                {groups.length === 0 && (
                  <Text size="sm" c="dimmed" ta="center" py="md">
                    No comments yet.
                  </Text>
                )}
                {groups.map(([anchorKey, list]) => (
                  <div key={anchorKey || "general"}>
                    <Divider
                      my={4}
                      label={
                        <Text size="xs" fw={700} c="dimmed">
                          {headingLabel(anchorKey)}
                        </Text>
                      }
                      labelPosition="left"
                    />
                    <Stack gap={6}>
                      {list.map((c) => (
                        <Item key={c.id} c={c} />
                      ))}
                    </Stack>
                  </div>
                ))}
              </Stack>
            </ScrollArea.Autosize>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="log" pt="sm">
          <ScrollArea.Autosize mah="calc(100vh - 160px)">
            <Stack gap={6}>
              {log.length === 0 && (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  No activity yet.
                </Text>
              )}
              {log.map((c) => (
                <Item key={c.id} c={c} showFile />
              ))}
            </Stack>
          </ScrollArea.Autosize>
        </Tabs.Panel>
      </Tabs>
    </Drawer>
  );
}
