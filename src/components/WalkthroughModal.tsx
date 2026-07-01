import { Modal, Group, Text, Accordion, List, Badge, Kbd, Stack } from "@mantine/core";
import {
  IconCompass,
  IconSearch,
  IconLink,
  IconTable,
  IconMessageCircle,
  IconEdit,
  IconMessage2,
  IconWifi,
  IconMoon,
} from "@tabler/icons-react";

export default function WalkthroughModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap={6}>
          <IconCompass size={18} />
          <Text fw={700}>How to use the SRS Knowledge Base</Text>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          A searchable, cross-linked home for the SRS across all three
          products — with an AI assistant grounded strictly in the documents
          themselves.
        </Text>

        <Accordion variant="separated" defaultValue="navigate">
          <Accordion.Item value="navigate">
            <Accordion.Control icon={<IconCompass size={16} />}>
              Switching products & navigating docs
            </Accordion.Control>
            <Accordion.Panel>
              <List size="sm" spacing={4}>
                <List.Item>
                  Use the dropdown next to the logo to switch between{" "}
                  <b>P1 LMS+SMS</b>, <b>P2 AI RevOps</b>, and{" "}
                  <b>P3 AI Student Coach</b>.
                </List.Item>
                <List.Item>
                  The left sidebar is the document tree for the current
                  product — folders group content by layer/part; a{" "}
                  <b>Shared</b> section below it (Decision Log, Requirement ID
                  Register) is available to every product.
                </List.Item>
                <List.Item>
                  On mobile, tap the ☰ menu icon in the header to open the
                  tree; it closes automatically once you pick a file.
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="search">
            <Accordion.Control icon={<IconSearch size={16} />}>
              Search
            </Accordion.Control>
            <Accordion.Panel>
              <List size="sm" spacing={4}>
                <List.Item>
                  The header search box matches on requirement/decision/screen
                  IDs (e.g. <Kbd>LMS-FR-057</Kbd>) as well as plain text across
                  headings and content.
                </List.Item>
                <List.Item>
                  Pick a result to jump straight to that heading in the
                  document, with it briefly highlighted.
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="crosslinks">
            <Accordion.Control icon={<IconLink size={16} />}>
              Cross-link chips
            </Accordion.Control>
            <Accordion.Panel>
              <List size="sm" spacing={4}>
                <List.Item>
                  Any ID mentioned in the text — requirements, business rules,
                  risks, decisions, screens, test cases — renders as a clickable
                  chip, e.g. <span className="xlink">LMS-FR-057</span>.
                </List.Item>
                <List.Item>
                  Clicking one jumps to exactly where that ID is defined, even
                  in a different file, and flashes it briefly so it's easy to
                  spot.
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="explorer">
            <Accordion.Control icon={<IconTable size={16} />}>
              Requirement Explorer
            </Accordion.Control>
            <Accordion.Panel>
              <List size="sm" spacing={4}>
                <List.Item>
                  Switch the <b>Docs / Requirements</b> toggle in the header to
                  see every requirement for the current product in one
                  filterable, sortable table.
                </List.Item>
                <List.Item>
                  Filter by module, priority, or free text; click an ID or test
                  case chip to jump back into the source document.
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="ai">
            <Accordion.Control icon={<IconMessageCircle size={16} />}>
              AI Assistant
            </Accordion.Control>
            <Accordion.Panel>
              <List size="sm" spacing={4}>
                <List.Item>
                  Ask questions in plain language — answers are grounded
                  strictly in the current product's SRS, with source chips you
                  can click to open the exact passage cited.
                </List.Item>
                <List.Item>
                  Toggle the panel from the header icon. It needs a
                  connection, so it's hidden automatically while offline.
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="editing">
            <Accordion.Control icon={<IconEdit size={16} />}>
              Editing, locking & version history
            </Accordion.Control>
            <Accordion.Panel>
              <List size="sm" spacing={4}>
                <List.Item>
                  Sign in, then click <b>Edit</b> and enter the shared edit
                  password once to unlock editing on your account — no need to
                  re-enter it after that.
                </List.Item>
                <List.Item>
                  Opening a document for editing locks it to you for a few
                  minutes so two people can't silently overwrite each other;
                  the lock badge shows who's editing.
                </List.Item>
                <List.Item>
                  Every save is a real, attributed git commit. Use the{" "}
                  <IconEdit size={12} style={{ verticalAlign: -2 }} /> history
                  icon to preview or restore any past version.
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="comments">
            <Accordion.Control icon={<IconMessage2 size={16} />}>
              Inline comments
            </Accordion.Control>
            <Accordion.Panel>
              <List size="sm" spacing={4}>
                <List.Item>
                  Select any text in a document to leave a comment on exactly
                  that passage, Google-Docs style — a margin icon appears next
                  to your selection.
                </List.Item>
                <List.Item>
                  Click a highlighted passage to open its comment thread; use
                  the header's comment icon to see every comment on the
                  current file.
                </List.Item>
                <List.Item>
                  Comments made while offline are queued and sync
                  automatically once you're back online — a{" "}
                  <Badge size="xs" variant="light">
                    pending
                  </Badge>{" "}
                  badge shows how many are still waiting.
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="offline">
            <Accordion.Control icon={<IconWifi size={16} />}>
              Offline mode & installing the app
            </Accordion.Control>
            <Accordion.Panel>
              <List size="sm" spacing={4}>
                <List.Item>
                  This app installs like a native app (look for an install
                  prompt, or your browser's install icon) and keeps working
                  offline — browsing, search, and cross-links all work without
                  a connection.
                </List.Item>
                <List.Item>
                  Only the AI assistant needs a connection; an{" "}
                  <Badge size="xs" color="orange" variant="light">
                    Offline
                  </Badge>{" "}
                  badge appears in the header when you lose one.
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="theme">
            <Accordion.Control icon={<IconMoon size={16} />}>
              Dark mode
            </Accordion.Control>
            <Accordion.Panel>
              <List size="sm" spacing={4}>
                <List.Item>
                  Toggle light/dark from the sun/moon icon in the header; it
                  follows your system preference by default and remembers your
                  choice after that.
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Text size="xs" c="dimmed" ta="center">
          Reopen this guide anytime from the ? icon in the header.
        </Text>
      </Stack>
    </Modal>
  );
}
