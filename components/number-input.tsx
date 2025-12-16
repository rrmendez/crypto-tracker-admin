import { useId } from "react";

import { Input } from "@/components/ui/input";

// ----------------------------------------------------------------------

export type NumberInputProps = React.ComponentProps<"input"> & {
  className?: string;
  label?: string;
  decimal?: number;
};

export function NumberInput({ className, label, decimal = 2, ...props }: NumberInputProps) {
  const id = useId();

  const placeholder = new Array(decimal).fill("0").join("");

  return (
    <Input
      id={label ? id : undefined}
      className={className}
      placeholder={`0.${placeholder}`}
      type="text"
      {...props}
    />
  );
}
