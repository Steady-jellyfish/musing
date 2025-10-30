"use client";

import { useState } from "react";
import { mockCategories, mockTags } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface NoteCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoteCreateDialog({
  open,
  onOpenChange,
}: NoteCreateDialogProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [content, setContent] = useState("");

  // Level 3 카테고리만 필터링 (실제 노트가 속할 수 있는 최하위 카테고리)
  const leafCategories = mockCategories.filter((cat) => cat.level === 3);

  const handleSave = () => {
    const noteData = {
      title,
      category_id: categoryId ? parseInt(categoryId) : null,
      tag_ids: selectedTags,
      original_text: content,
      created_at: new Date().toISOString(),
    };

    console.log("=== 노트 저장 데이터 ===");
    console.log(noteData);
    console.log("=======================");
    // TODO: API 연동

    // 다이얼로그 닫고 폼 초기화
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setCategoryId("");
    setSelectedTags([]);
    setContent("");
    onOpenChange(false);
  };

  const handleToggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags((prev) => prev.filter((id) => id !== tagId));
  };

  const isFormValid = title.trim() !== "" && categoryId !== "" && content.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>새 노트 작성</DialogTitle>
          <DialogDescription>
            노트의 제목, 카테고리, 태그, 내용을 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 제목 입력 */}
          <div className="grid gap-2">
            <Label htmlFor="title">
              제목 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="노트 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* 카테고리 선택 */}
          <div className="grid gap-2">
            <Label htmlFor="category">
              카테고리 <span className="text-red-500">*</span>
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {leafCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.full_path}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 태그 선택 */}
          <div className="grid gap-2">
            <Label htmlFor="tags">태그</Label>
            <div className="border rounded-md p-3">
              {/* 선택된 태그 표시 */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b">
                  {selectedTags.map((tagId) => {
                    const tag = mockTags.find((t) => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {tag.name}
                        <button
                          onClick={() => handleRemoveTag(tag.id)}
                          className="ml-1 hover:bg-muted rounded-sm p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* 태그 선택 버튼들 */}
              <div className="flex flex-wrap gap-2">
                {mockTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={
                      selectedTags.includes(tag.id) ? "default" : "outline"
                    }
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleToggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 내용 입력 */}
          <div className="grid gap-2">
            <Label htmlFor="content">
              내용 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="노트 내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-y"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
