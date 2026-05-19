import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import DotRunningCoach from "../components/cards/DotRunningCoach";
import CameraDotTransition from "../components/prototype/CameraDotTransition";
import PageShell from "../components/layout/PageShell";
import TopStatusBar from "../components/layout/TopStatusBar";
import { mlpTiles, prototypeCards } from "../lib/datasets/prototypeData";

export default function PrototypePage() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState("normal"); // "normal" | "dot"
  const [activeDot, setActiveDot] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [scenario, setScenario] = useState("home"); // "lock" | "home"
  const [scale, setScale] = useState(1);

  const LOCK_BG = "https://www.figma.com/api/mcp/asset/5f199753-bacf-4a91-acb7-8eb4910dbbe2";
  const HOME_BG = "https://www.figma.com/api/mcp/asset/fc376bb6-8550-447e-ad03-a9a04a2ff412";

  const handleTileClick = (title) => {
    if (title === "health") {
      goHealth();
      return;
    }
    if (title === "lock") {
      goLock();
      return;
    }
    if (title === "home") {
      goHome();
      return;
    }
    if (viewMode === "normal") {
      if (typeof window !== "undefined" && window.pipelineGenerate) {
        window.pipelineGenerate(title);
      }
    } else {
      setActiveDot(title);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const availableHeight = window.innerHeight - 180; // Margin for header/controls
      const availableWidth = window.innerWidth - 700;  // Sidebar (320) + Spacer (320) + Gaps
      const phoneHeight = 978; 
      const phoneWidth = 451;

      const scaleH = availableHeight / phoneHeight;
      const scaleW = availableWidth / phoneWidth;
      
      let newScale = Math.min(scaleH, scaleW);
      if (newScale > 1) newScale = 1;
      if (newScale < 0.2) newScale = 0.2; // Minimum scale
      
      setScale(newScale);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Ensure the phone has a base screen on load.
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (typeof window.generateSurfaceScenario === "function") {
        window.generateSurfaceScenario("tab-root");
        clearInterval(t);
      }
      if (tries > 40) clearInterval(t);
    }, 80);
    return () => {
      clearInterval(t);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const generateFromPrompt = () => {
    alert("현재 사용 불가한 기능입니다.");
    return;
    const v = String(prompt || "").trim();
    if (!v) return;
    if (typeof window !== "undefined" && window.pipelineGenerate) {
      window.pipelineGenerate(v);
    }
  };

  const goLock = () => {
    setScenario("lock");
    if (typeof window !== "undefined" && typeof window.generateSurfaceScenario === "function") {
      window.generateSurfaceScenario("lockscreen");
    }
  };

  const goHome = () => {
    setScenario("home");
    if (typeof window !== "undefined" && typeof window.generateSurfaceScenario === "function") {
      window.generateSurfaceScenario("tab-root");
    }
  };

  const goHealth = () => {
    setScenario("health");
    if (typeof window !== "undefined" && typeof window.generateSurfaceScenario === "function") {
      window.generateSurfaceScenario("health-mlp");
    }
  };

  const leftButtons =
    viewMode === "normal"
      ? [
          { key: "nav-health", label: "Health", value: "health" },
          { key: "nav-lock", label: "Lock", value: "lock" },
          { key: "nav-home", label: "Home", value: "home" },
        ]
      : [
          { key: "dot-running", label: "Running coach", value: "dot-running" },
          { key: "dot-camera", label: "Camera (dot)", value: "dot-camera" },
          { key: "nav-health", label: "Health", value: "health" },
          { key: "nav-lock", label: "Lock", value: "lock" },
          { key: "nav-home", label: "Home", value: "home" },
          { key: "dot-time-matrix", label: "Time Matrix", value: "dot-time-matrix", disabled: true },
          { key: "dot-music-1x1", label: "Music 1x1", value: "dot-music-1x1", disabled: true },
          { key: "dot-music-1x2", label: "Music 1x2", value: "dot-music-1x2-actions", disabled: true },
          { key: "dot-weather-2x1", label: "Weather 2x1", value: "dot-weather-2x1-v1-1", disabled: true },
          { key: "dot-temp-1x1", label: "Temp 1x1", value: "dot-temperature-1x1", disabled: true },
          { key: "dot-date-1x1", label: "Date 1x1", value: "dot-date-1x1-v1-1", disabled: true },
          { key: "dot-schedule-2x2", label: "Schedule 2x2", value: "dot-schedule-2x2", disabled: true },
        ];

  return (
    <>
      <Head>
        <title>GenUI - Samsung One UI 8.5 Design Builder</title>
        <style>{`
          body {
            background: #0b0b0e !important;
            overflow: hidden !important;
          }
          .app-shell {
            padding-top: 44px !important; /* Space for TopStatusBar */
            padding-bottom: 0 !important;
            max-width: none !important;
            width: 100% !important;
            margin: 0 !important;
            position: relative !important;
          }
          .app-header {
            margin-bottom: 0 !important;
            padding: 5px 20px !important;
          }
          .app-header h1, .app-brand {
            display: none !important;
          }
          .mlp-workspace {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: flex-start !important;
            gap: 40px !important;
            padding: 20px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
          .mlp-left {
            width: 320px !important;
            flex-shrink: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .mlp-btn-list {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .mlp-mini-btn {
            width: 100% !important;
            padding: 8px !important;
            font-size: 12px !important;
          }
          .mlp-generate {
            width: 100% !important;
            margin-top: 10px !important;
            pointer-events: none !important;
            opacity: 0.6 !important;
          }
          .mlp-right {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            flex-grow: 1 !important;
            max-width: 600px !important;
            min-width: 0 !important;
          }
          .canvas-frame.mlp-phone {
            height: 978px !important;
            width: 451px !important;
            margin: 0 !important;
            flex-shrink: 0 !important;
            border-radius: 44px !important;
            overflow: hidden !important;
          }
          .canvas-inner {
            zoom: 1 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
          }
          .canvas-wrap {
            transform-origin: top center;
            transition: transform 0.2s ease-out;
          }
          .mlp-phone-controls {
            margin-bottom: 15px !important;
            display: flex;
            justify-content: center;
            gap: 12px;
            width: 100%;
          }
          .mlp-phone-controls button {
            min-width: 80px;
            padding: 8px 16px !important;
          }
        `}</style>
      </Head>

      <PageShell
        backHref="/"
      >
        <TopStatusBar />
        <div className="mlp-workspace">
          <aside className="mlp-left">
            <div className="mlp-btn-list" aria-label="MLP buttons">
              {leftButtons.map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    className={"mlp-mini-btn" + (viewMode === "dot" && activeDot === b.value ? " is-active" : "") + (scenario === b.value ? " is-scenario-active" : "")}
                    onClick={() => !b.disabled && handleTileClick(b.value)}
                    disabled={b.disabled}
                    style={b.disabled ? { opacity: 0.4, cursor: "not-allowed" } : (scenario === b.value ? { borderColor: '#64e9e3', color: '#64e9e3' } : {})}
                  >
                  {b.label}
                </button>
              ))}
            </div>

            {viewMode === "dot" ? (
              <div style={{ marginTop: 14 }}>
                <CameraDotTransition
                  ensureCameraDot={() => {
                    setActiveDot("dot-camera");
                  }}
                  targetSelector="#dot-detail-preview .dot-cam"
                />
              </div>
            ) : null}

            <div className="mlp-generate">
              <div className="mlp-generate__title">AI UI Generate</div>
              <textarea
                className="mlp-generate__input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예) lock screen / notification / quick settings / list / detail ..."
              />
              <div className="mlp-generate__row">
                <button type="button" className="mlp-generate__btn" onClick={generateFromPrompt}>
                  Generate
                </button>
              </div>
            </div>
          </aside>

          <section className="mlp-right">
            {mounted && (viewMode === "normal" ? (
              <div className="canvas-wrap" id="canvasWrap" style={{ background: "transparent", padding: 0, margin: 0, display: "flex", justifyContent: "center", transform: `scale(${scale})` }}>
                <div style={{ position: "relative" }}>
                  <div className="canvas-frame mlp-phone" id="canvasFrame">
                    <div
                      className="canvas-inner"
                      id="canvas"
                      style={{
                        backgroundColor: scenario === "health" ? "#F2F2F2" : "#5974B2",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        justifyContent: "flex-start"
                      }}
                    ></div>
                  </div>
                </div>
                {/* Hidden output element required by pipelineGenerate */}
                <div id="pipelineOutput" style={{ display: "none" }}></div>
              </div>
            ) : (
              <div className="canvas-wrap" style={{ background: "transparent", padding: 0, margin: 0, display: "flex", justifyContent: "center", transform: `scale(${scale})` }}>
                <div style={{ position: "relative" }}>
                  <div className="canvas-frame mlp-phone">
                    <div className="canvas-inner" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#5974B2", overflow: "hidden" }}>
                      {activeDot === "dot-running" && <DotRunningCoach />}
                      {activeDot && activeDot !== "dot-running" && (
                        <div
                          id="dot-detail-preview"
                          style={{ zoom: 0.8 }}
                          dangerouslySetInnerHTML={{
                            __html:
                              typeof window !== "undefined" && typeof window.renderAtomicForRole === "function"
                                ? window.renderAtomicForRole({ role: activeDot }, { w: 310, h: 165 })
                                : "",
                          }}
                        />
                      )}
                      {!activeDot && <div style={{ color: "#999" }}>좌측에서 컴포넌트를 선택해주세요.</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Right spacer to balance the grid and keep the phone centered */}
          <div className="mlp-spacer" style={{ width: '320px', flexShrink: 0 }}></div>
        </div>
      </PageShell>

      {/* Load all required scripts for the prototype */}
      <Script src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/dist/html-to-image.js" strategy="beforeInteractive" />
      <Script src="/ui-state.js" strategy="beforeInteractive" />
      <Script src="/figma-refs/icon_library.js" strategy="beforeInteractive" />
      <Script src="/typography-rules.js" strategy="beforeInteractive" />
      <Script src="/generator.js" strategy="beforeInteractive" />
      <Script src="/design_memory.js" strategy="beforeInteractive" />
      <Script src="/app/state.js" strategy="beforeInteractive" />
      <Script src="/app/agent.js" strategy="beforeInteractive" />
      <Script src="/app/templates.js" strategy="beforeInteractive" />
      <Script src="/app/atomics.js" strategy="beforeInteractive" />
      <Script src="/app/design-doc.js" strategy="beforeInteractive" />
      <Script src="/app/interaction-state.js" strategy="beforeInteractive" />
      <Script src="/app/surface-layout.js?v=dot-music-preview-dot-delay-1" strategy="beforeInteractive" />
      <Script src="/app/settings.js" strategy="beforeInteractive" />
      <Script src="/app/canvas.js" strategy="beforeInteractive" />
      <Script src="/app/rules-renderer.js" strategy="beforeInteractive" />
      <Script src="/app/scenes.js" strategy="beforeInteractive" />
      <Script src="/app/scene-inspector.js" strategy="beforeInteractive" />
      <Script src="/app/cached-screens.js" strategy="beforeInteractive" />
      <Script src="/app/ui-panels.js" strategy="beforeInteractive" />
      <Script src="/app/main.js" strategy="beforeInteractive" />
      <Script src="/prototype-logic.js" strategy="lazyOnload" />
    </>
  );
}
