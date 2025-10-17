import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Hint from "@/components/hint";
import { useTRPC } from "@/trpc/client";

export default function ProjectHeader({ projectId }: { projectId: string }) {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId }),
  );

  return (
    <header className="p-3 flex justify-start items-center gap-4 h-[61px] border-b bg-background/50 backdrop-blur-sm">
      <Hint text="Go to Dashboard" side="bottom">
        <Link href="/" className="hover:scale-110 transition-transform group">
          <div className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeftIcon className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </Link>
      </Hint>
      <div className="flex gap-2.5 items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-lg blur group-hover:bg-primary/30 transition-colors"></div>
          <div className="relative p-1">
            <Image src="/logo.svg" alt="Vision2Web" width={24} height={24} />
          </div>
        </div>
        <span className="font-semibold text-base">{project.name}</span>
      </div>
    </header>
  );
}
