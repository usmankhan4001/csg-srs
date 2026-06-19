import { useState } from "react";

export default function LoginModal({
  onSubmit,
  onClose,
}: {
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
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-5 w-[320px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-bold text-sm mb-1">Unlock editing</h2>
        <p className="text-xs text-slate-500 mb-3">
          Enter the editor password to modify documents.
        </p>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Password"
          className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        {err && <div className="text-xs text-red-600 mt-2">{err}</div>}
        <div className="flex gap-2 mt-3">
          <button
            onClick={submit}
            disabled={busy || !pw}
            className="flex-1 bg-indigo-600 text-white text-sm rounded py-1.5 disabled:opacity-50 hover:bg-indigo-700"
          >
            {busy ? "Checking…" : "Unlock"}
          </button>
          <button
            onClick={onClose}
            className="px-3 text-sm border border-slate-300 rounded hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
