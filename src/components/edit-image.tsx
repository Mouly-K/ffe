import { IconAirBalloon } from "@tabler/icons-react";
import { Pencil, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function EditImage({ image }: { image: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-20 w-20 rounded-full">
          <Avatar className="h-20 w-20">
            <AvatarImage src={image} alt="@shadcn" />
            <AvatarFallback>
              <IconAirBalloon className="size-10 rotate-12" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem>
          <Pencil className="size-4" />
          Edit
          <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="size-4 text-destructive" />
          Delete
          <DropdownMenuShortcut className="text-destructive">
            ⇧⌘Q
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
