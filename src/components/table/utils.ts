import type { Table, RowData } from "@tanstack/react-table";
import { isEqualSansId } from "@/utils";

type obj = { id: string; [key: string]: string };

export function getFacetedUniqueValues<TData extends RowData>() {
  return (table: Table<TData>, columnId: string) => {
    const memoFn = () => {
      const facetedRowModel = table.getColumn(columnId)?.getFacetedRowModel();
      if (!facetedRowModel) return new Map();

      const facetedUniqueValues = new Map<string | obj, number>();

      for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
        const values = facetedRowModel.flatRows[i]!.getUniqueValues<
          string | obj
        >(columnId);

        for (let j = 0; j < values?.length; j++) {
          const newValue = values[j]!;
          let foundMatch = false;

          // For objects, we need to check deep equality with existing keys
          if (typeof newValue === "object" && newValue !== null) {
            for (const [
              existingValue,
              count,
            ] of facetedUniqueValues.entries()) {
              if (isEqualSansId(existingValue as obj, newValue)) {
                facetedUniqueValues.set(existingValue, count + 1);
                foundMatch = true;
                break;
              }
            }
            if (!foundMatch) {
              facetedUniqueValues.set(newValue, 1);
            }
          } else {
            // For primitive values, we can use direct comparison
            if (facetedUniqueValues.has(newValue)) {
              facetedUniqueValues.set(
                newValue,
                (facetedUniqueValues.get(newValue) ?? 0) + 1
              );
            } else {
              facetedUniqueValues.set(newValue, 1);
            }
          }
        }
      }

      return facetedUniqueValues;
    };

    // Return memoized function that will return the Map
    return memoFn;
  };
}
