import { CheckIcon, CopyIcon } from "lucide-react";
import { Fragment, useCallback, useMemo, useState } from "react";
import { convertFilesToTreeItems } from "@/lib/utils";
import CodeView from "./code-view";
import Hint from "./hint";
import TreeView from "./tree-view";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

export type FileCollection = {
  [path: string]: string;
};

function getLanguageFromExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "txt";
}

function FileBreadcrumb({ filePath }: { filePath: string }) {
  const pathSegments = filePath.split("/");
  const maxSegments = 3;

  const renderBreadcrumbItems = () => {
    if (pathSegments.length <= maxSegments) {
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;

        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">
                  {segment}
                </BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegment = pathSegments[0];
      const lastSegments = pathSegments[pathSegments.length - 1];

      return (
          <BreadcrumbItem>
            <span className="text-muted-foreground">{firstSegment}</span>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem></BreadcrumbItem>
            <BreadcrumbPage className="font-medium">
              {lastSegments}
            </BreadcrumbPage>
          </BreadcrumbItem>
      );
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  );
}

export default function FileExplorer({ files }: { files: FileCollection }) {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileNames = Object.keys(files);
    return fileNames.length > 0 ? fileNames[0] : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files],
  );

  const handleCopy = useCallback(() => {
    if (selectedFile && files[selectedFile]) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-muted/30 border-r">
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="w-1 hover:w-1.5 bg-border hover:bg-primary transition-all duration-200" />
      <ResizablePanel
        defaultSize={70}
        minSize={50}
        className="flex flex-col min-h-0 bg-gradient-to-br from-background to-muted/20"
      >
        {selectedFile && files[selectedFile] ? (
          <div className="flex h-full w-full flex-col min-h-0">
            <div className="border-b bg-background/80 backdrop-blur-sm px-4 py-3 flex justify-between items-center gap-x-2 shadow-sm">
              <FileBreadcrumb filePath={selectedFile} />
              <Hint text="Copy to Clipboard" side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto rounded-full hover:scale-105 transition-transform"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view it&apos;s content.
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
