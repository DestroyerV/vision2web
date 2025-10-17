"use client";

import { useAuth } from "@clerk/nextjs";
import { CodeIcon, CrownIcon, EyeIcon, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FileExplorer, { type FileCollection } from "@/components/file-explorer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserControl from "@/components/user-control";
import type { Fragment } from "@/generated/prisma";
import FragmentWeb from "../components/fragment-web";
import MessagesContainer from "../components/messages-container";
import MessagesContainerLoading from "../components/messages-container-loading";
import ProjectHeader from "../components/project-header";
import ProjectHeaderLoading from "../components/project-header-loading";

export default function ProjectView({ projectId }: { projectId: string }) {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });
  const { setTheme } = useTheme();

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0 border-r"
        >
          <ErrorBoundary fallback={<p>Project Header Error</p>}>
            <Suspense fallback={<ProjectHeaderLoading />}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary fallback={<p>Message Container Error</p>}>
            <Suspense fallback={<MessagesContainerLoading />}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle className="w-1 hover:w-1.5 bg-border hover:bg-primary transition-all duration-200" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-3 border-b gap-x-2 bg-background/50 backdrop-blur-sm">
              <TabsList className="h-9 p-1 border rounded-full bg-muted/50">
                <TabsTrigger
                  value="preview"
                  className="rounded-full gap-1.5 data-[state=active]:shadow-sm"
                >
                  <EyeIcon className="size-4" />
                  <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="rounded-full gap-1.5 data-[state=active]:shadow-sm"
                >
                  <CodeIcon className="size-4" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button
                    asChild
                    size="sm"
                    variant="tertiary"
                    className="rounded-full hover:scale-105 transition-transform shadow-sm"
                  >
                    <Link href="/pricing" className="gap-1.5">
                      <CrownIcon className="size-4" />
                      <span>Upgrade</span>
                    </Link>
                  </Button>
                )}
                <UserControl />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:scale-105 transition-transform"
                    >
                      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-2xl px-2 py-2"
                  >
                    <DropdownMenuItem
                      className="rounded-xl cursor-pointer"
                      onClick={() => setTheme("light")}
                    >
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-xl cursor-pointer"
                      onClick={() => setTheme("dark")}
                    >
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-xl cursor-pointer"
                      onClick={() => setTheme("system")}
                    >
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <TabsContent value="preview" className="m-0 p-0">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0 m-0 p-0">
              {!!activeFragment?.files && (
                <FileExplorer files={activeFragment.files as FileCollection} />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
