import { cn } from "@/lib/utils";
import Image from "next/image";

// ----------------------------------------------------------------------

type Props = {
  className?: string;
};

export function leht_logo({ className }: Props) {
  return (
    <Image
      src={"/assets/logos/leht.png"}
      alt="LEHT Logo"
      width={365}
      height={365}
      className={cn("h-24 w-24", className)}
    />
  );
}
