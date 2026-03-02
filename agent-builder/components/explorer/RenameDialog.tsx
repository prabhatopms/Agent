"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSolutionStore } from "@/state/solutionStore";

export function RenameDialog() {
  const { renameDialog, closeRenameDialog, renameNode } = useSolutionStore();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (renameDialog.open) setValue(renameDialog.currentLabel);
  }, [renameDialog.open, renameDialog.currentLabel]);

  const handleSave = () => {
    if (value.trim()) renameNode(renameDialog.nodeId, value.trim());
  };

  return (
    <Dialog open={renameDialog.open} onOpenChange={(open) => !open && closeRenameDialog()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[14px]">Rename</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Label className="text-[12px]">Name</Label>
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            className="mt-1.5 h-8 text-[12px]"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={closeRenameDialog} className="text-[12px]">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!value.trim()} className="text-[12px]">
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
