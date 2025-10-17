"use client";

import {
  AlertTriangle,
  ChevronDown,
  Home,
  MessageSquare,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  const isProduction = process.env.NODE_ENV === "production";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Main Error Card */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 dark:bg-destructive/20 mb-4">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            We encountered an unexpected error. Don't worry, our team has been
            notified and we're working on it.
          </p>
        </div>

        {/* Error Details Alert */}
        <Alert variant="destructive" className="shadow-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">Error Details</AlertTitle>
          <AlertDescription className="space-y-2">
            <p className="text-sm">
              {error.message || "An unexpected error occurred"}
            </p>
            {error.digest && (
              <p className="text-xs font-mono opacity-70">
                Error ID: {error.digest}
              </p>
            )}
          </AlertDescription>
        </Alert>

        {/* Technical Details (Collapsible) */}
        {!isProduction && error.stack && (
          <Collapsible className="space-y-2">
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
              <ChevronDown className="w-4 h-4 transition-transform duration-200 data-[state=open]:rotate-180" />
              <span>View technical details</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-4 border border-border">
                <pre className="text-xs overflow-x-auto font-mono text-muted-foreground whitespace-pre-wrap break-words">
                  {error.stack}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <Button onClick={reset} size="lg" className="w-full sm:w-auto gap-2">
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Help Section */}
        <div className="text-center space-y-3 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Still having issues? We're here to help.
          </p>
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <a href="mailto:support@vision2web.com">
              <MessageSquare className="w-4 h-4" />
              Contact Support
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
