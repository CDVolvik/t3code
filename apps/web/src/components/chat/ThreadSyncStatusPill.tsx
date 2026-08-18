import { ChevronDownIcon, LoaderCircleIcon } from "lucide-react";

import { threadSyncLabel, type ThreadSyncPhase } from "../../threadSync";
import { Button } from "../ui/button";

export function ThreadSyncStatusPill({ phase }: { readonly phase: ThreadSyncPhase }) {
  const label = threadSyncLabel(phase);

  return (
    <div
      aria-label={label}
      className="pointer-events-none flex w-fit max-w-full items-center gap-2 rounded-full border border-border/60 bg-card/95 px-3 py-1.5 text-foreground text-xs font-medium shadow-sm"
      role="status"
    >
      <LoaderCircleIcon aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate">{label}</span>
    </div>
  );
}

export function ThreadOverlayControls({
  composerOverlayHeight,
  onScrollToEnd,
  phase,
  showScrollToBottom,
}: {
  readonly composerOverlayHeight: number;
  readonly onScrollToEnd: () => void;
  readonly phase: ThreadSyncPhase | null;
  readonly showScrollToBottom: boolean;
}) {
  if (!showScrollToBottom && phase === null) {
    return null;
  }

  return (
    <div
      data-thread-overlay-controls="true"
      className="pointer-events-none absolute left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 py-1.5"
      style={{ bottom: composerOverlayHeight + 4 }}
    >
      {showScrollToBottom ? (
        <Button
          aria-label="Scroll to end"
          onClick={onScrollToEnd}
          className="pointer-events-auto gap-1.5 rounded-full px-3 text-muted-foreground hover:text-foreground"
          size="xs"
          variant="glass"
        >
          <ChevronDownIcon className="size-3.5" />
          Scroll to end
        </Button>
      ) : null}
      {phase ? <ThreadSyncStatusPill phase={phase} /> : null}
    </div>
  );
}
