"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const trpc = useTRPC();
  const { data: message } = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Message created");
      },
    })
  );
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button onClick={() => createMessage.mutate({ value: inputValue })}>
        Invoke Background Job
      </Button>
      <div className="mt-4">
        {message?.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-bold">{msg.role}:</span> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}
