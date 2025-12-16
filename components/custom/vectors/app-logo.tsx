import { cn } from "@/lib/utils";
import Image from "next/image";

// ----------------------------------------------------------------------

type Props = {
  className?: string;
};

export function AppLogo({ className }: Props) {
  return (
    <Image
      src={"/assets/images/logo.webp"}
      alt="App Logo"
      width={1331}
      height={1335}
      className={cn("h-24 w-auto", className)}
    />
  );
}

// ----------------------------------------------------------------------

export function AppLogoDark({ className }: Props) {
  return (
    <Image
      src={"/assets/images/logo-dark.webp"}
      alt="App Logo Text"
      width={1331}
      height={1335}
      className={cn("h-24 w-24", className)}
    />
  );
}

// ----------------------------------------------------------------------

export function AppLogoWithText({ className }: Props) {
  return (
    <Image
      src={"/assets/images/logo-with-text.webp"}
      alt="App Logo With Text"
      width={1062}
      height={429}
      className={cn("h-24 w-auto", className)}
      priority
    />
  );
}

// ----------------------------------------------------------------------

export function AppLogoWithTextDark({ className }: Props) {
  return (
    <Image
      src={"/assets/images/logo-with-text-dark.webp"}
      alt="App Logo With Text Dark"
      width={1062}
      height={429}
      className={cn("h-24 w-auto", className)}
    />
  );
}

// ----------------------------------------------------------------------

export function AppLogoWithTextHorizontal({ className }: Props) {
  return (
    <Image
      src={"/assets/images/logo-with-text-horizontal.webp"}
      alt="App Logo With Text Horizontal"
      width={1062}
      height={429}
      className={cn("h-24 w-auto", className)}
    />
  );
}

// ----------------------------------------------------------------------

export function AppLogoWithTextHorizontalDark({ className }: Props) {
  return (
    <Image
      src={"/assets/images/logo-with-text-horizontal-dark.webp"}
      alt="App Logo With Text Horizontal Dark"
      width={1062}
      height={429}
      className={cn("h-24 w-auto", className)}
    />
  );
}
