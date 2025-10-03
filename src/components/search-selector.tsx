import { useState } from "react";
import { Check, PlusCircleIcon, Search } from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { filterObject } from "@/utils";
import { Button } from "./ui/button";

interface SearchSelectorProps<T extends Record<K, T[K]>, K extends keyof T> {
  items: T;
  selectedKey?: K;
  renderItem: (key: K | undefined, item: T[K]) => React.ReactNode;
  onSelect: (key: K) => void;
  label?: string;
  children?: React.ReactNode;
  onAdd?: () => void;
  side?: "bottom" | "top" | "right" | "left";
  align?: "center" | "start" | "end";
  className?: string;
}

export function SearchSelector<T, K extends keyof T>({
  items,
  selectedKey,
  renderItem,
  onSelect,
  label = "Choose an item",
  children,
  onAdd,
  side,
  align,
}: SearchSelectorProps<T, K>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = filterObject(
    items,
    (key, value) =>
      (key as string).toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.entries(value as [K, T[K]]).some(([_, v]) =>
        (v as string).toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleSelect = (key: K) => {
    setSearchQuery("");
    setIsOpen(false);
    onSelect(key);
  };

  const selectedItem = selectedKey ? items[selectedKey] : undefined;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {children || (
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            {selectedItem && renderItem(selectedKey, selectedItem)}
            <IconDotsVertical className="ml-auto size-4" />
          </SidebarMenuButton>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={side || "bottom"}
        align={align || "start"}
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0">
          <span className="flex justify-between items-center px-3 py-2 font-medium">
            {label}
            {onAdd && (
              <Button
                variant="default"
                size="icon"
                className="h-7"
                onClick={() => {
                  setIsOpen(false);
                  onAdd();
                }}
              >
                <PlusCircleIcon />
              </Button>
            )}
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-64">
          <DropdownMenuGroup>
            {(Object.entries(filteredItems) as Array<[K, T[K]]>).map(
              ([key, item]) => (
                <DropdownMenuItem
                  key={key as string}
                  onClick={() => handleSelect(key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                    key === selectedKey && "bg-accent text-accent-foreground"
                  )}
                >
                  {renderItem(key, item)}
                  {key === selectedKey && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              )
            )}
            {Object.keys(filteredItems).length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                No items found
              </div>
            )}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
