"use client";

import * as React from "react";
import { AnimatePresence, motion, HTMLMotionProps } from "motion/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type ToggleVisibilityButtonProps = Omit<HTMLMotionProps<"button">, "children"> &
  VariantProps<typeof buttonVariants> & {
    isVisible?: boolean;
    onVisibilityChange?: (visible: boolean) => void;
  };

function ToggleVisibilityButton({
  isVisible,
  onVisibilityChange,
  className,
  size,
  variant = "outline",
  onClick,
  ...props
}: ToggleVisibilityButtonProps) {
  const isControlled = isVisible !== undefined;
  const [internalVisible, setInternalVisible] = React.useState(false);

  const visible = isControlled ? isVisible! : internalVisible;
  const Icon = visible ? EyeIcon : EyeOffIcon;

  const handleToggle = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const newValue = !visible;

      if (!isControlled) {
        setInternalVisible(newValue);
      }

      onVisibilityChange?.(newValue);
      onClick?.(e);
    },
    [visible, isControlled, onVisibilityChange, onClick]
  );

  return (
    <motion.button
      type="button"
      data-slot="toggle-visibility-button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={visible ? "eye" : "eyeoff"}
          data-slot="toggle-visibility-button-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Icon />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export { ToggleVisibilityButton, type ToggleVisibilityButtonProps };
