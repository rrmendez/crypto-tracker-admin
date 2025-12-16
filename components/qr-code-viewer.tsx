"use client";
import { useQRCode } from "next-qrcode";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

// ----------------------------------------------------------------------

type QrCodeProps = {
  value: string;
  currency?: string;
  isLoading?: boolean;
  slotProps?: {
    container?: {
      className?: string;
    };
    logo?: {
      url?: string;
    };
    qrCode?: {
      color?: {
        lightTheme?: {
          dark: string;
          light: string;
        };
        darkTheme?: {
          dark: string;
          light: string;
        };
      };
    };
  };
};

export default function QrCodeViewer({ value, currency, isLoading, slotProps }: QrCodeProps) {
  const { Canvas } = useQRCode();

  const { theme } = useTheme();

  if (!value) {
    return null;
  }

  const renderQR = (
    <Canvas
      text={value}
      options={{
        errorCorrectionLevel: "M",
        margin: 1,
        scale: 4,
        width: 200,
        ...(theme === "dark" && {
          color: {
            dark: "#fafafa",
            light: "#0a0a0a",
          },
        }),
      }}
      logo={
        !!currency
          ? {
              src: `/assets/images/currencies/${currency}_logo.webp`,
              options: {
                width: 45,
                x: undefined,
                y: undefined,
              },
            }
          : undefined
      }
    />
  );

  const renderLoading = <Skeleton className="rounded-lg w-[220px] h-[227px]" />;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 p-2 border-1 border-border rounded-lg",
        slotProps?.container?.className
      )}
    >
      {isLoading ? renderLoading : renderQR}
    </div>
  );
}
