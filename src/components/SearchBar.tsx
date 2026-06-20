import { useEffect, useRef, useState } from "react";
import {
  TextInput,
  Paper,
  ScrollArea,
  Badge,
  Text,
  Box,
  UnstyledButton,
  Group,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { search } from "../api";
import type { SearchHit } from "../types";

export default function SearchBar({
  product,
  onPick,
}: {
  product: string;
  onPick: (hit: SearchHit) => void;
}) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!q.trim()) {
      setHits([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setHits(await search(q, product));
        setOpen(true);
      } catch {
        /* ignore */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, product]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const idHits = hits.filter((h) => h.matchType === "id");
  const textHits = hits.filter((h) => h.matchType === "text");
  const grouped = new Map<string, SearchHit[]>();
  for (const h of textHits) {
    if (!grouped.has(h.part)) grouped.set(h.part, []);
    grouped.get(h.part)!.push(h);
  }

  const pick = (h: SearchHit) => {
    setOpen(false);
    setQ("");
    onPick(h);
  };

  const Row = ({ h, idBadge }: { h: SearchHit; idBadge?: boolean }) => (
    <UnstyledButton
      onClick={() => pick(h)}
      p="xs"
      style={{ display: "block", width: "100%", borderBottom: "1px solid var(--mantine-color-gray-1)" }}
      className="hover:bg-slate-50"
    >
      <Group gap="xs" wrap="nowrap">
        {idBadge && (
          <Badge size="xs" color="indigo">
            ID
          </Badge>
        )}
        <Box style={{ minWidth: 0 }}>
          <Text size="sm" fw={600} truncate>
            {h.heading}
          </Text>
          <Text size="xs" c="dimmed" truncate>
            {idBadge ? h.part : h.snippet}
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  );

  return (
    <Box ref={boxRef} style={{ position: "relative", width: "100%" }}>
      <TextInput
        size="xs"
        value={q}
        onChange={(e) => setQ(e.currentTarget.value)}
        onFocus={() => hits.length && setOpen(true)}
        leftSection={<IconSearch size={14} />}
        placeholder="Search requirements, IDs (LMS-FR-057), decisions, screens…"
      />
      {open && (idHits.length > 0 || grouped.size > 0) && (
        <Paper
          shadow="md"
          withBorder
          style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 300, marginTop: 4 }}
        >
          <ScrollArea.Autosize mah="60vh">
            {idHits.length > 0 && (
              <>
                <Text size="10px" tt="uppercase" c="dimmed" fw={700} px="xs" py={4} bg="gray.0">
                  Exact ID match
                </Text>
                {idHits.map((h) => (
                  <Row key={h.id} h={h} idBadge />
                ))}
              </>
            )}
            {[...grouped.entries()].map(([part, list]) => (
              <Box key={part}>
                <Text size="10px" tt="uppercase" c="dimmed" fw={700} px="xs" py={4} bg="gray.0">
                  {part}
                </Text>
                {list.map((h) => (
                  <Row key={h.id} h={h} />
                ))}
              </Box>
            ))}
          </ScrollArea.Autosize>
        </Paper>
      )}
    </Box>
  );
}
