import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------

type ButtonType = React.ComponentProps<"button"> & {
  badge?: React.ReactNode;
  badgeClassName?: string;
  selected?: boolean;
};

export function CircularIconButton({
  children,
  badge,
  badgeClassName,
  selected,
  className,
  ...props
}: ButtonType) {
  return (
    <Button
      size="icon"
      aria-checked={selected}
      className={cn(
        "h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/15 text-primary relative",
        "aria-checked:bg-[var(--primary-600)] dark:aria-checked:bg-[var(--primary-400)] aria-checked:text-white dark:aria-checked:text-neutral-800", // selected
        className
      )}
      {...props}
    >
      {children}
      {!!badge && (
        <div
          className={cn(
            "absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex flex-col items-center justify-center",
            badgeClassName
          )}
        >
          {badge}
        </div>
      )}
    </Button>
  );
}
