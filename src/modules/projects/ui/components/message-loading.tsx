import Image from "next/image";
import { Progress } from "@/components/ui/progress";

interface MessageLoadingProps {
  progressStep?: string;
  progressCurrent?: number;
  progressTotal?: number;
}

export default function MessageLoading({
  progressStep = "Initializing",
  progressCurrent = 0,
  progressTotal = 7,
}: MessageLoadingProps) {
  const progressPercentage = progressTotal > 0 
    ? Math.round((progressCurrent / progressTotal) * 100) 
    : 0;

  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="Vision2Web"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Vision2Web</span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {progressStep}
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        </div>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Step {progressCurrent} of {progressTotal}
            </span>
            <span className="text-xs font-medium text-primary">
              {progressPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
