import { useState } from "react";
import type { TreeNode } from "../types";

const prettyDir = (name: string) =>
  name.replace(/^\d+[_-]?/, "").replace(/_/g, " ");

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
    const active = node.path === activePath;
    return (
      <button
        onClick={() => node.path && onOpen(node.path)}
        title={node.title}
        className={`w-full text-left truncate px-2 py-1 rounded text-[13px] ${
          active ? "bg-indigo-100 text-indigo-800 font-semibold" : "hover:bg-slate-100"
        }`}
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        {node.name.replace(/\.md$/, "").replace(/_/g, " ")}
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-2 py-1 rounded text-[13px] font-semibold text-slate-700 hover:bg-slate-100 truncate"
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        <span className="inline-block w-3 text-slate-400">
          {open ? "▾" : "▸"}
        </span>{" "}
        {prettyDir(node.name)}
      </button>
      {open &&
        node.children?.map((c, i) => (
          <Node
            key={c.path || c.name + i}
            node={c}
            depth={depth + 1}
            activePath={activePath}
            onOpen={onOpen}
          />
        ))}
    </div>
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
    <div className="py-2">
      {tree.map((n, i) => (
        <Node
          key={n.name + i}
          node={n}
          depth={0}
          activePath={activePath}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
