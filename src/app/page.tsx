"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}));
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Button onClick={() => invoke.mutate({ text: "hello world" })}>
        Invoke Background Job
      </Button>
    </div>
  );
}
