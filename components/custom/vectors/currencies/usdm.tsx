import { cn } from "@/lib/utils";
import Image from "next/image";

// ----------------------------------------------------------------------

type Props = {
  className?: string;
};

export function usdm_logo({ className }: Props) {
  return (
    <Image
      src={"/assets/logos/usdm.png"}
      alt="USDM Logo"
      width={256}
      height={256}
      className={cn("h-24 w-24", className)}
    />
  );
}
