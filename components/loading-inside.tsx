"use client";

import { cn } from "@/lib/utils";
import { IndeterminateProgress } from "./ui/progress";

// ----------------------------------------------------------------------

type Props = {
  children?: React.ReactNode;
  slots?: {
    root?: {
      className?: string;
    };
    loading?: {
      className?: string;
    };
  };
};

// ----------------------------------------------------------------------

export default function LoadingInside(props: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-screen text-center px-4",
        props.slots?.root?.className
      )}
    >
      <IndeterminateProgress className={cn("max-w-sm", props.slots?.loading?.className)} />
      {props.children}
    </div>
  );
}
