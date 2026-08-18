import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import { ThreadOverlayControls, ThreadSyncStatusPill } from "./ThreadSyncStatusPill";

describe("ThreadSyncStatusPill", () => {
  it.each([
    ["loading", "Loading messages..."],
    ["syncing", "Syncing messages..."],
  ] as const)("renders the %s message sync phase", (phase, label) => {
    const markup = renderToStaticMarkup(<ThreadSyncStatusPill phase={phase} />);

    expect(markup).toContain('role="status"');
    expect(markup).toContain(label);
    expect(markup).not.toContain("animate-");
  });

  it("stacks scroll and sync controls in one overlay above the composer", () => {
    const markup = renderToStaticMarkup(
      <ThreadOverlayControls
        composerOverlayHeight={180}
        phase="syncing"
        showScrollToBottom
        onScrollToEnd={() => undefined}
      />,
    );

    expect(markup).toContain('data-thread-overlay-controls="true"');
    expect(markup).toMatch(/class="[^"]*\babsolute\b/);
    expect(markup).toMatch(/class="[^"]*\bflex-col\b/);
    expect(markup).not.toContain("flex-col-reverse");
    expect(markup).toContain("bottom:184px");
    expect(markup).toContain("Scroll to end");
    expect(markup).toContain("Syncing messages...");
    expect(markup.indexOf("Scroll to end")).toBeLessThan(markup.indexOf("Syncing messages..."));
  });
});
