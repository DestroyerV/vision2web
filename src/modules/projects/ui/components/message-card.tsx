import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card className="rounded-2xl bg-primary/10 dark:bg-primary/20 p-3.5 shadow-sm border border-primary/20 max-w-[80%] break-words hover:shadow-md transition-shadow">
        <p className="text-sm leading-relaxed">{content}</p>
      </Card>
    </div>
  );
};

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      type="button"
      className={cn(
        "flex items-start text-start gap-3 border-2 rounded-2xl bg-gradient-to-r from-muted to-muted/50 w-fit p-3.5 hover:scale-[1.02] transition-all duration-200 hover:shadow-md group",
        isActiveFragment &&
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30",
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <div className={cn(
        "p-2 rounded-lg bg-background/50 group-hover:bg-background/70 transition-colors",
        isActiveFragment && "bg-primary-foreground/20 group-hover:bg-primary-foreground/30"
      )}>
        <Code2Icon className="size-4" />
      </div>
      <div className="flex flex-col flex-1 gap-0.5">
        <span className="text-sm font-semibold line-clamp-1">
          {fragment.title}
        </span>
        <span className="text-xs opacity-80">Click to preview</span>
      </div>
      <div className="flex items-center justify-center mt-1">
        <ChevronRightIcon className={cn(
          "size-4 transition-transform group-hover:translate-x-0.5",
          isActiveFragment && "animate-pulse"
        )} />
      </div>
    </button>
  );
};

interface AssistantMessageProps {
  content: string;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: AssistantMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4 hover:bg-muted/30 rounded-xl transition-colors",
        type === "ERROR" && "text-red-700 dark:text-red-500",
      )}
    >
      <div className="flex items-center gap-2.5 pl-2 mb-2.5">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-lg blur"></div>
          <div className="relative p-1.5 bg-background rounded-lg border border-primary/10">
            <Image
              src="/logo.svg"
              alt="Vision2Web"
              width={16}
              height={16}
              className="shrink-0"
            />
          </div>
        </div>
        <span className="text-sm font-semibold">Vision2Web</span>
        <span className="text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 bg-muted px-2 py-0.5 rounded-full">
          {format(createdAt, "HH:mm 'on' MMM dd, yyy")}
        </span>
      </div>
      <div className="pl-9 flex flex-col gap-y-3">
        <span className="text-sm leading-relaxed">{content}</span>
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}
export default function MessageCard({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: MessageCardProps) {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    );
  }

  return <UserMessage content={content} />;
}
