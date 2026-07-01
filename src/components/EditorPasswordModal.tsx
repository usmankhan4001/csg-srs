import { useState } from "react";
import { Modal, PasswordInput, Button, Group, Text } from "@mantine/core";

// Shown to a signed-in user who wants to unlock editing for their account.
// Enter the shared EDIT_PASSWORD once — after that, editing is tied to their
// real identity (locking + git commit attribution use their account).
export default function EditorPasswordModal({
  opened,
  onSubmit,
  onClose,
}: {
  opened: boolean;
  onSubmit: (password: string) => Promise<void>;
  onClose: () => void;
}) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setErr(null);
    try {
      await onSubmit(pw);
      setPw("");
    } catch (e: any) {
      setErr(e?.message || "Incorrect password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Unlock editing" centered size="sm">
      <Text size="xs" c="dimmed" mb="sm">
        Enter the editor password to enable editing for your account. Edits and
        version history will be attributed to you from now on.
      </Text>
      <PasswordInput
        data-autofocus
        value={pw}
        onChange={(e) => setPw(e.currentTarget.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Editor password"
        error={err}
      />
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} loading={busy} disabled={!pw}>
          Unlock
        </Button>
      </Group>
    </Modal>
  );
}
