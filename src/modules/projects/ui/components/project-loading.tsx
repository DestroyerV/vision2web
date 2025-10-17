import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectLoading() {
  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 max-w-md w-full px-6">
        <div className="relative">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg animate-pulse" />
        </div>
        <div className="text-center space-y-2 w-full">
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
        <div className="w-full space-y-2 mt-4">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-3/4 mx-auto" />
        </div>
      </div>
    </div>
  );
}
