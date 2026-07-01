import { useState } from "react";
import { NavLink } from "@mantine/core";
import { IconFolder, IconFolderOpen, IconFileText } from "@tabler/icons-react";
import type { TreeNode } from "../types";

// Virtual "Part N" group folders come through as the SRS's own all-caps H1
// text (e.g. "PART 4 — FUNCTIONAL REQUIREMENTS"); title-case those so the
// sidebar doesn't read as shouting. Real on-disk folder names (already mixed
// case, e.g. "Layer_1_Business_Strategy") pass through untouched.
const titleCaseIfShouty = (s: string) => {
  const letters = s.replace(/[^A-Za-z]/g, "");
  if (!letters || letters !== letters.toUpperCase()) return s;
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
};
const prettyDir = (name: string) =>
  titleCaseIfShouty(name.replace(/^\d+[_-]?/, "").replace(/_/g, " "));
const prettyFile = (name: string) => name.replace(/\.md$/, "").replace(/_/g, " ");

function Node({
  node,
  depth,
  activePath,
  onOpen,
}: {
  node: TreeNode;
  depth: number;
  activePath: string | null;
  onOpen: (path: string) => void;
}) {
  const [open, setOpen] = useState(depth < 2);

  if (node.type === "file") {
    return (
      <NavLink
        active={node.path === activePath}
        label={node.label || prettyFile(node.name)}
        title={node.title}
        leftSection={<IconFileText size={15} />}
        onClick={() => node.path && onOpen(node.path)}
        styles={{ label: { fontSize: 13 }, root: { paddingLeft: 8 + depth * 12 } }}
      />
    );
  }

  return (
    <NavLink
      label={prettyDir(node.name)}
      leftSection={open ? <IconFolderOpen size={15} /> : <IconFolder size={15} />}
      opened={open}
      onClick={() => setOpen((o) => !o)}
      childrenOffset={0}
      styles={{ label: { fontSize: 13, fontWeight: 600 }, root: { paddingLeft: 8 + depth * 12 } }}
    >
      {open &&
        node.children?.map((c, i) => (
          <Node key={c.path || c.name + i} node={c} depth={depth + 1} activePath={activePath} onOpen={onOpen} />
        ))}
    </NavLink>
  );
}

export default function FileTree({
  tree,
  activePath,
  onOpen,
}: {
  tree: TreeNode[];
  activePath: string | null;
  onOpen: (path: string) => void;
}) {
  return (
    <div>
      {tree.map((n, i) => (
        <Node key={n.name + i} node={n} depth={0} activePath={activePath} onOpen={onOpen} />
      ))}
    </div>
  );
}
