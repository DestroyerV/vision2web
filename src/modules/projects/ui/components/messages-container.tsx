import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { Fragment } from "@/generated/prisma/wasm";
import { useTRPC } from "@/trpc/client";
import MessageCard from "./message-card";
import MessageForm from "./message-form";
import MessageLoading from "./message-loading";

export default function MessagesContainer({
  projectId,
  activeFragment,
  setActiveFragment,
}: {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageRef = useRef<string | null>(null);

  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId },
      { refetchInterval: 2000 },
    ),
  );

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (m) => m.role === "ASSISTANT",
    );

    if (
      lastAssistantMessage?.fragment &&
      lastAssistantMessage.id !== lastAssistantMessageRef.current
    ) {
      setActiveFragment(lastAssistantMessage.fragment);
      lastAssistantMessageRef.current = lastAssistantMessage.id;
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";
  
  // Find the in-progress message if it exists
  const progressMessage = messages.find(
    (m) => m.role === "ASSISTANT" && m.type === "IN_PROGRESS"
  );

  // Filter out IN_PROGRESS messages from display
  const displayMessages = messages.filter(
    (m) => m.type !== "IN_PROGRESS"
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background/30">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-3 pr-2 pl-2">
          {displayMessages.map((message, index) => (
            <div 
              key={message.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
            >
              <MessageCard
                content={message.content}
                role={message.role}
                fragment={message.fragment}
                createdAt={message.createdAt}
                isActiveFragment={activeFragment?.id === message.fragment?.id}
                onFragmentClick={() => setActiveFragment(message.fragment)}
                type={message.type}
              />
            </div>
          ))}

          {(isLastMessageUser || progressMessage) && (
            <MessageLoading 
              progressStep={progressMessage?.progressStep ?? undefined}
              progressCurrent={progressMessage?.progressCurrent ?? undefined}
              progressTotal={progressMessage?.progressTotal ?? undefined}
            />
          )}

          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative pt-2 p-3 pb-4">
        <div className="absolute -top-8 left-0 right-0 h-8 bg-linear-to-b from-transparent via-background/50 to-background pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
}
