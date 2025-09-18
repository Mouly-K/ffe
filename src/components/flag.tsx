import { cn } from "@/lib/utils";

function Flag({
  flag,
  className,
}: React.ComponentProps<"span"> & { flag: string }) {
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
