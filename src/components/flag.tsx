import { cn } from "@/lib/utils";

import type { CountryFlag } from "@/types/country";

function Flag({
  flag,
  className,
}: React.ComponentProps<"span"> & { flag: CountryFlag }) {
  return (
    <div
      className={cn(
        "h-8 w-8 text-xl flex justify-center items-center font-[BabelStoneFlags]",
        className
      )}
    >
      {flag}
    </div>
  );
}

export default Flag;
