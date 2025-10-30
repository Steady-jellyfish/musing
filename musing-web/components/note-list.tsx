"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Note } from "@/types";
import { Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteListProps {
  notes: Note[];
  selectedNoteId: number | null;
  onSelectNote: (noteId: number) => void;
}

export function NoteList({ notes, selectedNoteId, onSelectNote }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>이 카테고리에 노트가 없습니다.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-4">
        {notes.map((note) => (
          <Card
            key={note.id}
            className={cn(
              "cursor-pointer transition-colors hover:bg-accent",
              selectedNoteId === note.id && "border-primary"
            )}
            onClick={() => onSelectNote(note.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{note.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {note.refined_text}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(note.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                {note.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>{note.tags.map((t) => t.name).join(", ")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
