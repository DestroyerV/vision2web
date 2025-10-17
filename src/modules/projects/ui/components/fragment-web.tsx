import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import type { Fragment } from "@/generated/prisma";

export default function FragmentWeb({ data }: { data: Fragment }) {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-br from-background to-muted/10">
      <div className="p-3 border-b bg-background/80 backdrop-blur-sm flex items-center gap-x-2 shadow-sm">
        <Hint text="Refresh Preview" side="bottom" align="start">
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            className="rounded-full hover:scale-105 transition-transform"
          >
            <RefreshCcwIcon className="size-4" />
          </Button>
        </Hint>
        <Hint text={copied ? "Copied!" : "Click to Copy URL"} side="bottom">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!data.sandboxUrl || copied}
            className="flex-1 justify-start text-start font-normal rounded-full hover:bg-muted transition-colors"
          >
            <span className="truncate text-xs text-muted-foreground">{data.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint text="Open in New Tab" side="bottom" align="end">
          <Button
            size="sm"
            disabled={!data.sandboxUrl}
            variant="outline"
            className="rounded-full hover:scale-105 transition-transform"
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <iframe
          key={fragmentKey}
          title="preview"
          className="h-full w-full relative z-10 rounded-lg"
          sandbox="allow-forms allow-scripts allow-same-origin"
          loading="lazy"
          src={data.sandboxUrl}
        />
      </div>
    </div>
  );
}
