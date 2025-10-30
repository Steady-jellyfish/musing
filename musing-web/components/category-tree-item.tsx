"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryTreeItemProps {
  category: Category;
  selectedId: number | null;
  onSelect: (categoryId: number) => void;
}

export function CategoryTreeItem({
  category,
  selectedId,
  onSelect,
}: CategoryTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedId === category.id;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent",
          isSelected && "bg-accent"
        )}
        onClick={() => onSelect(category.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-accent-foreground/10 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}
        {isExpanded && hasChildren ? (
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Folder className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-sm flex-1">{category.name}</span>
        {category.noteCount !== undefined && category.noteCount > 0 && (
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {category.noteCount}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4 border-l pl-2 mt-1 space-y-1">
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
