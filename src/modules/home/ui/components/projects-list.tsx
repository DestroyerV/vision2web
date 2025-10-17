"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";

export default function ProjectsList() {
  const trpc = useTRPC();

  const { user } = useUser();

  const { data: projects, isLoading } = useQuery(trpc.projects.getMany.queryOptions());

  if (!user) return null;

  return (
    <div className="w-full bg-white/50 dark:bg-sidebar/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-border flex flex-col gap-y-6 sm:gap-y-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
        <h2 className="text-2xl font-semibold">
          {user?.firstName}&apos;s Projects
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-2xl border bg-background/50 space-y-3">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : projects?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="size-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="No projects"
                >
                  <title>No projects</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">No projects yet</p>
              <p className="text-xs text-muted-foreground">Create your first project above to get started</p>
            </div>
          </div>
        ) : (
          <>
            {projects?.map((project, index) => (
              <Button
                key={project.id}
                variant="outline"
                className="font-normal h-auto justify-start w-full text-start p-4 rounded-2xl group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:border-primary/30 bg-background/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
                asChild
              >
            <Link href={`/projects/${project.id}`}>
              <div className="flex items-center gap-x-4 w-full">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur group-hover:bg-primary/30 transition-colors"></div>
                  <div className="relative bg-background rounded-xl p-2 border border-primary/10 group-hover:border-primary/30 transition-colors">
                    <Image
                      src="/logo.svg"
                      alt="Vision2Web"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="truncate font-semibold group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <svg
                      className="size-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-label="Last updated"
                    >
                      <title>Last updated</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <svg
                  className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Open project"
                >
                  <title>Open project</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          </Button>
        ))}
          </>
        )}
      </div>
    </div>
  );
}
