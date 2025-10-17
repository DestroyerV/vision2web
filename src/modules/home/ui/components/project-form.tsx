"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { PROJECT_TEMPLATES } from "../../constants";

const formSchema = z.object({
  value: z
    .string()
    .min(1, "Value is required")
    .max(1000, "Value must be at most 1000 characters long"),
});

export default function ProjectForm() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());

        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }

        if (error.data?.code === "TOO_MANY_REQUESTS") {
          router.push("/pricing");
        }
      },
    }),
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({
      value: values.value,
    });
  };

  const onSelect = (value: string) => {
    form.setValue("value", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const isPending = createProject.isPending;
  const isDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <section className="space-y-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border-2 p-4 pt-1 rounded-3xl bg-sidebar/50 dark:bg-sidebar/50 backdrop-blur-sm transition-all duration-300",
            isFocused &&
              "shadow-lg shadow-primary/10 border-primary/30 scale-[1.01]",
            !isFocused &&
              "border-border hover:border-primary/20 hover:shadow-md",
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
                className="pt-4 resize-none border-none w-full outline-none bg-transparent text-base"
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
        <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.title}
              variant="outline"
              size="sm"
              className="bg-white/50 dark:bg-sidebar/50 backdrop-blur-sm rounded-full hover:scale-105 hover:shadow-md transition-all duration-200 hover:bg-primary/5 hover:border-primary/30"
              onClick={() => onSelect(template.prompt)}
            >
              <span className="text-base mr-1">{template.emoji}</span>{" "}
              {template.title}
            </Button>
          ))}
        </div>
      </section>
    </Form>
  );
}
