import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-6 gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">musing</h1>
        </div>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="검색..."
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
