import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "loose",
  flowchart: { useMaxWidth: false, htmlLabels: true, curve: "basis" },
});

let counter = 0;

export default function Mermaid({ code }: { code: string }) {
  const hostRef = useRef<HTMLDivElement>(null); // intersection target
  const svgRef = useRef<HTMLDivElement>(null); // holds the rendered svg
  const [svg, setSvg] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // pan/zoom state
  const view = useRef({ scale: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  // Render only once the diagram scrolls near the viewport (keeps long docs snappy)
  useEffect(() => {
    if (!hostRef.current || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(hostRef.current);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    const id = `mmd-${counter++}`;
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch((e) => {
        if (!cancelled) setErr(String(e?.message || e));
      });
    return () => {
      cancelled = true;
    };
  }, [visible, code]);

  const applyTransform = () => {
    const g = svgRef.current?.querySelector("svg") as SVGSVGElement | null;
    if (g)
      g.style.transform = `translate(${view.current.x}px,${view.current.y}px) scale(${view.current.scale})`;
  };

  useEffect(() => {
    const g = svgRef.current?.querySelector("svg") as SVGSVGElement | null;
    if (g) {
      g.style.transformOrigin = "0 0";
      g.style.transition = "transform 0.05s linear";
      applyTransform();
    }
  }, [svg]);

  const zoom = (factor: number) => {
    view.current.scale = Math.min(
      6,
      Math.max(0.3, view.current.scale * factor)
    );
    applyTransform();
  };
  const reset = () => {
    view.current = { scale: 1, x: 0, y: 0 };
    applyTransform();
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return; // only zoom with ctrl/cmd, else let page scroll
    e.preventDefault();
    zoom(e.deltaY < 0 ? 1.1 : 0.9);
  };
  const onDown = (e: React.MouseEvent) => {
    drag.current = { x: e.clientX - view.current.x, y: e.clientY - view.current.y };
  };
  const onMove = (e: React.MouseEvent) => {
    if (!drag.current) return;
    view.current.x = e.clientX - drag.current.x;
    view.current.y = e.clientY - drag.current.y;
    applyTransform();
  };
  const onUp = () => (drag.current = null);

  if (err)
    return (
      <pre className="ascii-wf" style={{ whiteSpace: "pre-wrap" }}>
        {`Diagram could not render:\n${code}`}
      </pre>
    );

  return (
    <div className="mermaid-wrap" ref={hostRef}>
      <div className="mermaid-toolbar">
        <button onClick={() => zoom(1.2)} title="Zoom in">＋</button>
        <button onClick={() => zoom(0.8)} title="Zoom out">－</button>
        <button onClick={reset} title="Reset">⟳</button>
        <span className="mermaid-hint">drag to pan · Ctrl+scroll to zoom</span>
      </div>
      <div
        className="mermaid-stage"
        ref={svgRef}
        onWheel={onWheel}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ cursor: svg ? "grab" : "default" }}
      />
      {!svg && !err && (
        <div className="mermaid-loading">Rendering diagram…</div>
      )}
    </div>
  );
}
