import { useEffect, useState } from "react";
import { Modal, Group, Button, Text, Image, Stack, List, ThemeIcon } from "@mantine/core";
import { IconCheck, IconDownload } from "@tabler/icons-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "srs_pwa_dismissed";

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    // already running as an installed app, or previously dismissed → skip
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore iOS
      window.navigator.standalone === true;
    if (standalone || localStorage.getItem(DISMISS_KEY) === "1") return;

    const show = (e: BeforeInstallPromptEvent) => {
      setDeferred(e);
      setOpened(true);
    };
    // event may have fired before React mounted (captured in index.html)
    const early = (window as any).__installPromptEvent as BeforeInstallPromptEvent | null;
    if (early) show(early);

    const onReady = () => {
      const e = (window as any).__installPromptEvent as BeforeInstallPromptEvent | null;
      if (e) show(e);
    };
    const onPrompt = (e: Event) => {
      e.preventDefault();
      show(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setOpened(false);
      setDeferred(null);
    };
    window.addEventListener("installpromptready", onReady);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("installpromptready", onReady);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setOpened(false);
    setDeferred(null);
  };

  const later = () => {
    setOpened(false);
  };
  const never = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setOpened(false);
  };

  return (
    <Modal opened={opened} onClose={later} centered size="sm" title={null} withCloseButton={false}>
      <Stack gap="md" align="center">
        <Image src="/icon.svg" w={72} h={72} alt="app icon" />
        <Text fw={700} size="lg" ta="center">
          Install SRS Knowledge Base
        </Text>
        <Text size="sm" c="dimmed" ta="center">
          Install the app on your desktop for a faster, full-screen experience —
          and to read the SRS, search, and comment even when you're offline.
        </Text>
        <List
          spacing={4}
          size="sm"
          center
          icon={
            <ThemeIcon color="olive" size={18} radius="xl">
              <IconCheck size={12} />
            </ThemeIcon>
          }
          style={{ alignSelf: "stretch" }}
        >
          <List.Item>Works offline (docs, search, comments)</List.Item>
          <List.Item>Opens in its own window</List.Item>
          <List.Item>One click from your desktop / Start menu</List.Item>
        </List>
        <Group justify="space-between" w="100%" mt="xs">
          <Button variant="subtle" color="gray" size="xs" onClick={never}>
            Don't ask again
          </Button>
          <Group gap="xs">
            <Button variant="default" size="sm" onClick={later}>
              Later
            </Button>
            <Button size="sm" leftSection={<IconDownload size={16} />} onClick={install}>
              Install
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
}
