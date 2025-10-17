import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectHeaderLoading() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="flex gap-2 items-center">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </div>
  );
}
