"use client";

import { useState } from "react";
import { Check, Search } from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import {
  CURRENCY_NAME,
  CURRENCY,
  COUNTRY_FLAGS,
  type Currency,
} from "../interfaces/currency";

interface CurrencySelectorProps {
  selectedCurrency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
}

export function CurrencySelector({
  selectedCurrency = "USD",
  onCurrencyChange,
}: CurrencySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const currencies = Object.values(CURRENCY);

  const filteredCurrencies = currencies.filter((currency) =>
    currency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCurrencySelect = (currency: Currency) => {
    onCurrencyChange?.(currency);
    setIsOpen(false);
    setSearchQuery("");
  };

  const { isMobile } = useSidebar();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            {/* <AvatarImage src={user?.avatar} alt={user?.name} /> */}
            <AvatarFallback className="rounded-lg text-xs font-[BabelStoneFlags]">
              {COUNTRY_FLAGS[selectedCurrency]}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{selectedCurrency}</span>
            <span className="text-muted-foreground truncate text-xs">
              {CURRENCY_NAME[selectedCurrency]}
            </span>
          </div>
          <IconDotsVertical className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0">
          <span className="flex px-3 py-2 font-medium">Choose a currency</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Search currencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-64">
          <DropdownMenuGroup>
            {filteredCurrencies.map((currency) => (
              <DropdownMenuItem
                key={currency}
                onClick={() => handleCurrencySelect(currency)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                  selectedCurrency === currency &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={user?.avatar} alt={user?.name} /> */}
                  <AvatarFallback className="rounded-lg text-xs font-[BabelStoneFlags]">
                    {COUNTRY_FLAGS[currency]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{currency}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {CURRENCY_NAME[currency]}
                  </span>
                </div>
                {selectedCurrency === currency && (
                  <Check className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
            {filteredCurrencies.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                No currencies found
              </div>
            )}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
