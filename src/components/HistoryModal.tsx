import { useEffect, useState } from "react";
import {
  Modal,
  Stack,
  Group,
  Text,
  Button,
  ScrollArea,
  Paper,
  Badge,
  Divider,
} from "@mantine/core";
import { IconEye, IconHistory, IconRestore } from "@tabler/icons-react";
import { fetchVersion, restoreVersion } from "../api";
import { getUser } from "../commentsClient";
import MarkdownView from "./MarkdownView";
import type { FileCommit } from "../types";

export default function HistoryModal({
  opened,
  onClose,
  filePath,
  history,
  currentContent,
  onRestored,
}: {
  opened: boolean;
  onClose: () => void;
  filePath: string;
  history: FileCommit[];
  currentContent: string;
  onRestored: (content: string) => void;
}) {
  const [preview, setPreview] = useState<{ hash: string; content: string } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (!opened) setPreview(null);
  }, [opened]);

  const doPreview = async (hash: string) => {
    setLoading(hash);
    try {
      const content = await fetchVersion(filePath, hash);
      setPreview({ hash, content });
    } catch (e: any) {
      // surface nothing fancy — the button state resets and they can retry
    } finally {
      setLoading(null);
    }
  };

  const doRestore = async (hash: string) => {
    const user = getUser();
    if (!user) return;
    setRestoring(hash);
    try {
      const r = await restoreVersion(filePath, hash, user.token);
      onRestored(r.content);
      setPreview(null);
      onClose();
    } finally {
      setRestoring(null);
    }
  };

  const canRestore = getUser()?.role === "editor";

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap={6}>
          <IconHistory size={18} />
          <Text fw={700}>Version history</Text>
        </Group>
      }
      size={preview ? "xl" : "md"}
      centered
    >
      {preview ? (
        <Stack gap="sm">
          <Group justify="space-between">
            <Badge variant="light">Viewing {preview.hash}</Badge>
            <Group gap="xs">
              {canRestore && (
                <Button
                  size="xs"
                  color="orange"
                  leftSection={<IconRestore size={14} />}
                  loading={restoring === preview.hash}
                  onClick={() => doRestore(preview.hash)}
                >
                  Restore this version
                </Button>
              )}
              <Button size="xs" variant="default" onClick={() => setPreview(null)}>
                Back to list
              </Button>
            </Group>
          </Group>
          <ScrollArea.Autosize mah="60vh">
            <div className="prose-srs" style={{ fontSize: 13.5 }}>
              <MarkdownView
                content={preview.content}
                filePath={filePath}
                navTarget={null}
                wireframeImages={new Set()}
                onCrossLink={() => {}}
                onSearchRef={() => {}}
              />
            </div>
          </ScrollArea.Autosize>
        </Stack>
      ) : (
        <ScrollArea.Autosize mah="70vh">
          <Stack gap={6}>
            {history.length === 0 && (
              <Text size="sm" c="dimmed" ta="center" py="md">
                No history yet for this document.
              </Text>
            )}
            {history.map((h, i) => (
              <Paper key={h.hash} withBorder p="xs" radius="md">
                <Group justify="space-between" wrap="nowrap">
                  <div>
                    <Group gap={6}>
                      <Text size="sm" fw={600}>
                        {h.author}
                      </Text>
                      {i === 0 && (
                        <Badge size="xs" color="olive" variant="light">
                          current
                        </Badge>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed">
                      {h.date} · {h.subject} · {h.hash}
                    </Text>
                  </div>
                  {i > 0 && (
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconEye size={14} />}
                      loading={loading === h.hash}
                      onClick={() => doPreview(h.hash)}
                    >
                      Preview
                    </Button>
                  )}
                </Group>
                {i < history.length - 1 && <Divider mt={6} />}
              </Paper>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      )}
    </Modal>
  );
}
