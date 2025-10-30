"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CategoryTreeItem } from "@/components/category-tree-item";
import { Category } from "@/types";

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number) => void;
}

export function Sidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-4">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-1">
            {categories.map((category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                selectedId={selectedCategoryId}
                onSelect={onSelectCategory}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
