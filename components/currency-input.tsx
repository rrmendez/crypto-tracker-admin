import { useId, useMemo } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getSymbolByCurrencyCode } from "@/utils/format-number";
import { Button } from "./ui/button";

// ----------------------------------------------------------------------

export type CurrencyInputProps = React.ComponentProps<"input"> & {
  className?: string;
  label?: string;
  decimal?: number;
  currency?: string;
  onMax?: () => void;
};

export function CurrencyInput({
  className,
  label,
  decimal = 2,
  currency = "BRL",
  onMax,
  ...props
}: CurrencyInputProps) {
  const id = useId();

  const placeholder = new Array(decimal).fill("0").join("");

  const symbol = getSymbolByCurrencyCode(currency);

  const sameCodeSymbol = useMemo(
    () => symbol.toLowerCase() === currency.toLowerCase(),
    [symbol, currency]
  );

  return (
    <div className="relative">
      {!sameCodeSymbol && (
        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm">
          {symbol}
        </span>
      )}
      <Input
        id={label ? id : undefined}
        className={cn("pe-25", !sameCodeSymbol && "ps-6", className)}
        placeholder={`0.${placeholder}`}
        type="text"
        {...props}
      />
      <div className="absolute top-1/2 end-4 -translate-y-1/2 text-muted-foreground inline-flex items-center text-sm">
        {currency.toUpperCase()}

        {!!onMax && (
          <Button type="button" size="sm" variant="link" className="px-1 ms-2" onClick={onMax}>
            Max
          </Button>
        )}
      </div>
    </div>
  );
  // return (
  //   <div className="*:not-first:mt-2">
  //     {label && <Label htmlFor={id}>{label}</Label>}
  //     <div className="relative flex rounded-md shadow-xs">
  //       {!sameCodeSymbol && (
  //         <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm">
  //           {symbol}
  //         </span>
  //       )}
  //       <Input
  //         id={label ? id : undefined}
  //         className={cn(
  //           "-me-px rounded-e-none shadow-none border-r-0",
  //           !sameCodeSymbol && "ps-6",
  //           className
  //         )}
  //         placeholder={`0.${placeholder}`}
  //         type="text"
  //         {...props}
  //       />
  //       <div className="border-input text-muted-foreground inline-flex items-center rounded-e-md border border-l-0 px-3 text-sm">
  //         {currency.toUpperCase()}

  //         {!!onMax && (
  //           <Button type="button" size="sm" variant="link" className="px-1 ms-2" onClick={onMax}>
  //             Max
  //           </Button>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
}
