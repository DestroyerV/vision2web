import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpIcon, ChevronDown, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TextAreaAutoSize from "react-textarea-autosize";
import { toast } from "sonner";
import z from "zod";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import Usage from "./usage";

const formSchema = z.object({
  value: z
    .string()
    .min(1, "Value is required")
    .max(1000, "Value must be at most 1000 characters long"),
});

export default function MessageForm({ projectId }: { projectId: string }) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: usage } = useQuery(trpc.usage.status.queryOptions());

  const [isFocused, setIsFocused] = useState(false);
  const showUsage = !!usage;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId }),
        );
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "TOO_MANY_REQUESTS") {
          router.push("/pricing");
        }
      },
    }),
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId,
    });
  };

  const isPending = createMessage.isPending;
  const isDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      {showUsage && (
        <Usage
          points={usage.remainingPoints}
          msBeforeNext={usage.msBeforeNext}
        />
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border-2 p-4 pt-1 rounded-3xl bg-sidebar/50 dark:bg-sidebar/50 backdrop-blur-sm transition-all duration-300",
          isFocused &&
            "shadow-lg shadow-primary/10 border-primary/30 scale-[1.01]",
          !isFocused && "border-border hover:border-primary/20 hover:shadow-md",
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextAreaAutoSize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="pt-4 resize-none border-none w-full outline-none bg-transparent text-sm"
              placeholder="What would you like to build?"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />
        <div className="flex gap-x-2 items-center justify-between pt-2">
          <Hint text="Coming soon..." side="top">
            <div className="text-xs text-muted-foreground flex items-center gap-1 font-mono border rounded-full px-3 py-1.5 cursor-pointer hover:bg-muted transition-colors">
              <span className="relative flex h-1.5 w-1.5 mr-1">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              Gemini 2.5 Flash
              <ChevronDown className="size-3.5" />
            </div>
          </Hint>
          <div className="flex gap-x-2 items-center justify-end pt-2">
            <div className="text-[10px] text-muted-foreground font-mono hidden sm:block">
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span>&#8984;</span>Enter
              </kbd>
            </div>
            <Button
              className={cn(
                "size-9 rounded-full transition-all duration-300",
                isDisabled && "bg-muted-foreground/20 border opacity-50",
                !isDisabled && "shadow-md hover:shadow-lg hover:scale-110",
              )}
              disabled={isDisabled}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <ArrowUpIcon className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
