import { useState } from "react";
import { Modal, Tabs, TextInput, PasswordInput, Button, Stack, Text } from "@mantine/core";
import { register, login } from "../commentsClient";

export default function UserAuthModal({
  opened,
  onClose,
  onAuthed,
}: {
  opened: boolean;
  onClose: () => void;
  onAuthed: () => void;
}) {
  const [tab, setTab] = useState<string | null>("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setErr(null);
    try {
      if (tab === "register") await register(username, displayName, password);
      else await login(username, password);
      onAuthed();
      onClose();
      setPassword("");
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Sign in to comment" centered size="sm">
      <Tabs value={tab} onChange={setTab}>
        <Tabs.List grow>
          <Tabs.Tab value="login">Sign in</Tabs.Tab>
          <Tabs.Tab value="register">Create account</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Stack gap="sm" mt="md">
        <TextInput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
          placeholder="e.g. usman"
        />
        {tab === "register" && (
          <TextInput
            label="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.currentTarget.value)}
            placeholder="Usman Khan"
          />
        )}
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {err && (
          <Text size="xs" c="red">
            {err}
          </Text>
        )}
        <Button onClick={submit} loading={busy}>
          {tab === "register" ? "Create account" : "Sign in"}
        </Button>
      </Stack>
    </Modal>
  );
}
