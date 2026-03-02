"use client";

import { useEffect } from "react";
import { useSolutionStore } from "@/state/solutionStore";
import { GlobalHeader } from "./GlobalHeader";
import { BuildToolbar } from "./BuildToolbar";
import { ResizablePanels } from "./ResizablePanels";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

export function AppShell() {
  const { appStatus, appError, simulateLoad, resetError } = useSolutionStore();

  useEffect(() => {
    simulateLoad();
  }, []);

  return (
    /*
     * 3-row grid:
     *   row 1 — GlobalHeader  (48px)
     *   row 2 — BuildToolbar  (40px)
     *   row 3 — content pane  (1fr)
     */
    <div
      style={{
        display: "grid",
        gridTemplateRows: "48px 40px 1fr",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <GlobalHeader />
      <BuildToolbar />

      {appStatus === "loading" && <LoadingSkeleton />}
      {appStatus === "error" && (
        <ErrorState message={appError} onRetry={resetError} />
      )}
      {appStatus === "ready" && <ResizablePanels />}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center h-full bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-muted-foreground">Loading solution…</p>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-full bg-background">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm px-6">
        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <p className="text-[13px] font-semibold mb-1">Failed to load</p>
          <p className="text-[12px] text-muted-foreground">{message}</p>
        </div>
        <Button size="sm" variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </Button>
      </div>
    </div>
  );
}
