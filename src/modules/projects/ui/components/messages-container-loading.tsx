import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesContainerLoading() {
  return (
    <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
      {/* Message 1 */}
      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="pl-7 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Message 2 */}
      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="pl-7 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      {/* Message 3 */}
      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="pl-7 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}
