"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { NoteList } from "@/components/note-list";
import { NoteViewer } from "@/components/note-viewer";
import { NoteCreateButton } from "@/components/note-create-button";
import {
  mockCategories,
  mockNotes,
  buildCategoryTree,
  getNotesByCategory,
} from "@/lib/mock-data";

export default function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  const categoryTree = useMemo(() => buildCategoryTree(mockCategories), []);

  const currentNotes = useMemo(() => {
    if (selectedCategoryId === null) return [];
    return getNotesByCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  const currentNote = useMemo(() => {
    if (selectedNoteId === null) return null;
    return mockNotes.find((note) => note.id === selectedNoteId) || null;
  }, [selectedNoteId]);

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setSelectedNoteId(null);
  };

  const handleSelectNote = (noteId: number) => {
    setSelectedNoteId(noteId);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          categories={categoryTree}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />
        <main className="flex-1 flex overflow-hidden">
          <div className="w-96 border-r overflow-hidden">
            {selectedCategoryId ? (
              <NoteList
                notes={currentNotes}
                selectedNoteId={selectedNoteId}
                onSelectNote={handleSelectNote}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>카테고리를 선택해주세요.</p>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <NoteViewer note={currentNote} />
          </div>
        </main>
      </div>
      <NoteCreateButton />
    </div>
  );
}
