"use client";

import { useEffect } from "react";
import { TopBar } from "./TopBar";
import { ResizablePanels } from "./ResizablePanels";
import { useSolutionStore } from "@/state/solutionStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export function AppShell() {
  const { appStatus, appError, simulateLoad, resetError } = useSolutionStore();

  useEffect(() => {
    simulateLoad();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      <TopBar />

      {appStatus === "loading" && <LoadingSkeleton />}
      {appStatus === "error" && <ErrorState message={appError} onRetry={resetError} />}
      {appStatus === "ready" && <ResizablePanels />}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-1 overflow-hidden gap-0">
      {/* Explorer skeleton */}
      <div className="w-60 border-r border-border p-3 flex flex-col gap-2 shrink-0">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-36" />
        <div className="mt-2" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-40" />
        <div className="mt-2" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Canvas skeleton */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-1 w-0.5 h-8" />
          <Skeleton className="h-16 w-48 rounded-lg" />
          <Skeleton className="h-8 w-0.5" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Inspector skeleton */}
      <div className="w-80 border-l border-border p-4 flex flex-col gap-3 shrink-0">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
        <div className="mt-2" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-full" />
        <div className="mt-2" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-32 w-full" />
        <div className="mt-2" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">Failed to load solution</p>
          <p className="text-sm text-muted-foreground">{message ?? "An unknown error occurred."}</p>
        </div>
        <Button size="sm" variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </Button>
      </div>
    </div>
  );
}
