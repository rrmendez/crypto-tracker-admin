import { Skeleton } from "@/components/ui/skeleton";

// ----------------------------------------------------------------------

export default function FinancialWalletsSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-3 p-4 bg-card rounded-lg">
      <Skeleton className="h-6 w-40 rounded" />
      <div className="flex flex-col items-center justify-center bg-muted/40 rounded-lg px-6 py-4 shadow-inner w-full max-w-sm">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-8 w-40 rounded" />
      </div>
      <div className="flex item-center gap-2">
        <Skeleton className="size-10 rounded-md" />
        <Skeleton className="size-10 rounded-md" />
        <Skeleton className="size-10 rounded-md" />
      </div>
    </div>
  );
}
