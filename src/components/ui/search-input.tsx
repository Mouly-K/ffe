import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  debounce?: number;
  clasName?: string;
  inputClassName?: string;
};

function SearchInput({
  value,
  onChange,
  debounce,
  clasName,
  inputClassName,
}: SearchInputProps) {
  const [query, setQuery] = useState("");

  const timeout = useRef<number>(undefined);
  function handleChange(e: any) {
    clearTimeout(timeout.current);
    setQuery(e.target.value);
    timeout.current = setTimeout(() => {
      onChange(e.target.value);
    }, debounce || 0);
  }

  useEffect(() => {
    setQuery(value); // To sync external value changes with internal query
  }, [value]);

  return (
    <div
      className={`flex items-center border border-input rounded-md px-3 w-[150px] lg:w-[250px] gap-2 ${
        clasName && clasName
      }`}
    >
      <Search className="size-4 opacity-50" />
      <input
        placeholder="Search shippers..."
        type="search"
        value={query}
        onChange={handleChange}
        className={`placeholder:text-muted-foreground flex w-full bg-transparent text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 h-8 border-none rounded-none ${
          inputClassName && inputClassName
        }`}
      />
    </div>
  );
}

export default SearchInput;
