"use client";

import { useState } from "react";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Tag, Edit2, X, Check } from "lucide-react";

interface NoteViewerProps {
  note: Note | null;
}

export function NoteViewer({ note }: NoteViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>노트를 선택해주세요.</p>
      </div>
    );
  }

  const handleEdit = () => {
    setEditedText(note.refined_text);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText("");
  };

  const handleSave = () => {
    // TODO: API 연동 시 저장 로직 추가
    console.log("Saving note:", editedText);
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="m-4 flex-1 flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-3">{note.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(note.created_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {note.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Tag className="h-4 w-4" />
                    <div className="flex gap-2">
                      {note.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                편집
              </Button>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 pt-6 flex flex-col">
          {isEditing ? (
            <>
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="flex-1 resize-none font-mono text-sm"
                placeholder="노트 내용을 입력하세요..."
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  저장
                </Button>
                <Button variant="outline" onClick={handleCancel} size="sm">
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-auto">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {note.refined_text}
                </pre>
              </div>
              {note.original_text !== note.refined_text && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    원본 텍스트
                  </h3>
                  <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
                    {note.original_text}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
