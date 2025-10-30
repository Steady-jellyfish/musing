"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NoteCreateDialog } from "@/components/note-create-dialog";
import { PenTool } from "lucide-react";

export function NoteCreateButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
        onClick={() => setIsDialogOpen(true)}
        aria-label="새 노트 작성"
      >
        <PenTool className="h-6 w-6" />
      </Button>

      <NoteCreateDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
