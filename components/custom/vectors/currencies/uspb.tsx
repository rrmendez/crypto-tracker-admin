import { cn } from "@/lib/utils";
import Image from "next/image";

// ----------------------------------------------------------------------

type Props = {
  className?: string;
};

export function uspb_logo({ className }: Props) {
  return (
    <Image
      src={"/assets/logos/balboa.webp"}
      alt="USPB Logo"
      width={500}
      height={500}
      className={cn("h-24 w-24", className)}
    />
  );
}
