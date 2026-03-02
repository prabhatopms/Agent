"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, X } from "lucide-react";
import { SolutionTree } from "./SolutionTree";
import { ResourceList } from "./ResourceList";
import { RenameDialog } from "./RenameDialog";

export function ExplorerPanel() {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="h-full border-r border-border flex flex-col bg-background">
      {/* Panel header */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-1 shrink-0">
        <span className="text-[12px] font-semibold text-foreground flex-1">
          Explorer
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 shrink-0 text-muted-foreground hover:text-foreground"
          title="New item"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 shrink-0 text-muted-foreground hover:text-foreground"
          title="Search"
          onClick={() => setSearchOpen((v) => !v)}
        >
          <Search className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Inline search bar (toggled) */}
      {searchOpen && (
        <div className="px-2 py-1.5 border-b border-border shrink-0">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-6 pr-6 h-7 text-[12px] bg-muted/40 border-0 focus-visible:ring-1"
            />
            {search && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch("")}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* TOP: Solution tree — scrollable */}
      <ScrollArea className="flex-1 min-h-0">
        <SolutionTree searchQuery={search} />
      </ScrollArea>

      {/* Divider */}
      <Separator />

      {/* BOTTOM: Resource list — fixed height with overflow */}
      <div className="shrink-0 overflow-y-auto" style={{ maxHeight: "40%" }}>
        <ResourceList />
      </div>

      <RenameDialog />
    </div>
  );
}
