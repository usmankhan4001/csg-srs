import { useState } from "react";
import { Modal, PasswordInput, Button, Group, Text } from "@mantine/core";

export default function LoginModal({
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
      setErr(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Unlock editing" centered size="sm">
      <Text size="xs" c="dimmed" mb="sm">
        Enter the editor password to modify documents.
      </Text>
      <PasswordInput
        data-autofocus
        value={pw}
        onChange={(e) => setPw(e.currentTarget.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Password"
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
