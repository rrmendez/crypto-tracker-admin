import { cn } from "@/lib/utils";
import Image from "next/image";

// ----------------------------------------------------------------------

type Props = {
  className?: string;
};

export function usbb_logo({ className }: Props) {
  return (
    <Image
      src={"/assets/logos/balboa_baby.webp"}
      alt="USPB Logo"
      width={500}
      height={500}
      className={cn("h-24 w-24", className)}
    />
  );
}
