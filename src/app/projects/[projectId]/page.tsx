import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ProjectErrorBoundary } from "@/components/project-error-boundary";
import ProjectLoading from "@/modules/projects/ui/components/project-loading";
import ProjectView from "@/modules/projects/ui/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({ projectId }),
  );
  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({ id: projectId }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectErrorBoundary>
        <Suspense fallback={<ProjectLoading />}>
          <ProjectView projectId={projectId} />
        </Suspense>
      </ProjectErrorBoundary>
    </HydrationBoundary>
  );
}
