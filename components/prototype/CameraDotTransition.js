import { useCallback, useEffect, useRef, useState } from "react";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForElement(selector, timeoutMs) {
  const deadline = Date.now() + (timeoutMs || 1500);
  while (Date.now() < deadline) {
    const el = document.querySelector(selector);
    if (el) return el;
    await sleep(50);
  }
  return null;
}

export default function CameraDotTransition({
  ensureCameraDot,
  targetSelector,
  auto = true,
  timeoutMs = 1600,
  highlightMs = 900,
}) {
  const [status, setStatus] = useState("idle"); // idle | working | ready
  const cleanupRef = useRef(null);

  const clearHighlight = useCallback(() => {
    if (cleanupRef.current) cleanupRef.current();
    cleanupRef.current = null;
  }, []);

  const run = useCallback(async () => {
    if (typeof document === "undefined") return;
    clearHighlight();
    setStatus("working");

    try {
      if (typeof ensureCameraDot === "function") await ensureCameraDot();
      const selector = targetSelector || "#preview-grid .dot-cam";
      const el = await waitForElement(selector, timeoutMs);

      if (!el) {
        setStatus("idle");
        return;
      }

      // Gentle visual hint without relying on global CSS.
      const prevOutline = el.style.outline;
      const prevOutlineOffset = el.style.outlineOffset;
      const prevBoxShadow = el.style.boxShadow;

      el.style.outline = "2px solid rgba(100, 233, 227, 0.95)";
      el.style.outlineOffset = "3px";
      el.style.boxShadow = "0 0 0 6px rgba(100,233,227,0.18)";

      cleanupRef.current = () => {
        el.style.outline = prevOutline;
        el.style.outlineOffset = prevOutlineOffset;
        el.style.boxShadow = prevBoxShadow;
      };

      setStatus("ready");
      window.setTimeout(() => {
        clearHighlight();
        setStatus("idle");
      }, highlightMs);
    } catch (_) {
      setStatus("idle");
    }
  }, [clearHighlight, ensureCameraDot, highlightMs, targetSelector, timeoutMs]);

  useEffect(() => {
    if (!auto) return;
    // Run after first paint so preview grid exists.
    const id = window.setTimeout(() => run(), 50);
    return () => window.clearTimeout(id);
  }, [auto, run]);

  useEffect(() => clearHighlight, [clearHighlight]);

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <button
        type="button"
        onClick={run}
        style={{
          height: 30,
          padding: "0 12px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.85)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.2,
          cursor: "pointer",
        }}
      >
        Camera dot focus
      </button>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
        {status === "working" ? "찾는 중…" : status === "ready" ? "포커스됨" : ""}
      </span>
    </div>
  );
}

