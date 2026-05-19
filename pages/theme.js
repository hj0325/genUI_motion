import Script from "next/script";
import CameraDotTransition from "../components/prototype/CameraDotTransition";

export default function ThemePage() {
  return (
    <>
      <span id="active-pill" style={{ display: "none" }}></span>

      <div className="toolbar">
        <a href="/" className="toolbar-back" title="Go back to Home">
          ← Home
        </a>
        <label>Theme</label>
        <select id="theme-select" className="theme-select"></select>
        <div className="flat-scheme-toggle" id="flat-scheme-toggle" aria-label="Flat theme color scheme">
          <span className="scheme-label">Flat</span>
          <button type="button" className="flat-scheme-btn" data-flat-scheme="dark" aria-pressed="true">
            블랙 배경
          </button>
          <button type="button" className="flat-scheme-btn" data-flat-scheme="light" aria-pressed="false">
            화이트 배경
          </button>
        </div>
        <div className="preview-bg-swatches" id="preview-bg-swatches" aria-label="Preview background colors">
          <span className="swatch-label">Preview BG</span>
          <button type="button" className="preview-bg-swatch" data-preview-bg="#2f6264" style={{ "--swatch": "#2f6264" }} aria-label="다크 민트 배경" aria-pressed="true"></button>
          <button type="button" className="preview-bg-swatch" data-preview-bg="#6f7478" style={{ "--swatch": "#6f7478" }} aria-label="그레이 배경" aria-pressed="false"></button>
          <button type="button" className="preview-bg-swatch" data-preview-bg="#0a0a0c" style={{ "--swatch": "#0a0a0c" }} aria-label="블랙 배경" aria-pressed="false"></button>
          <button type="button" className="preview-bg-swatch" data-preview-bg="#f4f5f6" style={{ "--swatch": "#f4f5f6" }} aria-label="화이트 배경" aria-pressed="false"></button>
        </div>
        <span className="spacer"></span>
        <button type="button" id="btn-normal" className="secondary" title="Original preview data">
          normal
        </button>
        <button type="button" id="btn-dot" className="secondary" title="New input data">
          dot
        </button>
        <span id="unsaved-pill" style={{ display: "none", padding: "4px 10px", borderRadius: "999px", background: "rgba(245,166,35,0.18)", color: "#F5A623", fontSize: "11.5px", fontWeight: 600 }}>
          Unsaved changes
        </span>
      </div>

      <main className="theme-main" style={{ height: "calc(100vh - 80px)", overflow: "hidden" }}>
        <div className="layout-row" id="theme-layout-row">
          {/* Left Column: Detail / Animation Test (Black Background) */}
          <div className="detail-col" id="detail-col">
            <div style={{ padding: "0 0 14px" }}>
              <CameraDotTransition
                ensureCameraDot={async () => {
                  if (typeof document === "undefined") return;
                  // Ensure Dot dataset + Cards mode so the camera card exists in preview grid.
                  const btnDot = document.getElementById("btn-dot");
                  if (btnDot) btnDot.click();
                  const btnCards = document.querySelector('.preview-mode-btn[data-mode="cards"]');
                  if (btnCards) btnCards.click();
                  await new Promise((r) => setTimeout(r, 80));
                  const cam = document.querySelector("#preview-grid .dot-cam");
                  if (cam && cam.scrollIntoView) {
                    cam.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
                  }
                  await new Promise((r) => setTimeout(r, 50));
                }}
                targetSelector="#preview-grid .dot-cam"
              />
            </div>
            <div className="detail-view" id="detail-view">
              <div className="detail-stage-container">
                <div className="detail-stage" id="detail-stage">
                  <div style={{ color: "var(--text-3)", fontSize: "14px" }}>Select a card to test animation</div>
                </div>
              </div>
              <div className="detail-controls" id="detail-controls" style={{ display: "none" }}></div>
            </div>
          </div>

          {/* Right Column: Full Preview Grid (Mint Background) */}
          <div className="preview-col" id="preview-col">
            <div className="preview-header-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div className="preview-mode-toggle" id="preview-mode-toggle" role="tablist" aria-label="Preview mode">
                <button type="button" className="preview-mode-btn active" data-mode="cards" aria-selected="true">
                  Cards
                </button>
                <button type="button" className="preview-mode-btn" data-mode="screen" aria-selected="false">
                  Screen
                </button>
              </div>
            </div>
            
            <h2 id="preview-mode-title" style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "12px 0 16px" }}>
              Live preview · all themed cards
            </h2>

            <div className="preview-theme-scope" id="preview-theme-scope">
              <div className="preview-grid" id="preview-grid"></div>
              
              <div className="preview-screen-wrap" id="preview-screen-wrap" style={{ display: "none" }}>
                <div className="preview-screen-grid" id="preview-screen-grid"></div>
                <div className="preview-screen-hint">
                  6 scenarios · S26 aspect (19.5:9) · each phone mixes 1-col and 2-col groups so the same card type renders in both contexts. Uses your <code>--screen-padding-*</code>, <code>--gap-screen</code>, <code>--gap-cards</code>, <code>--screen-grid-columns</code> tokens.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="toast" id="toast">
        Saved · theme applied
      </div>

      <Script src="/typography-rules.js" strategy="beforeInteractive" />
      <Script src="/app/atomics.js" strategy="beforeInteractive" />
      <Script src="/app/surface-layout.js?v=dot-music-preview-dot-delay-1" strategy="beforeInteractive" />
      <Script src="/app/dot-clock21-mask-calibrate.js?v=1" strategy="afterInteractive" />
      <Script src="/datasets/normalPreviewCards.js" strategy="beforeInteractive" />
      <Script src="/datasets/dotPreviewCards.js?v=dot-music-title-1" strategy="beforeInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" strategy="beforeInteractive" />
      <Script src="/theme-logic.js?v=dot-camera-preview-ratio-1" strategy="lazyOnload" />
    </>
  );
}
