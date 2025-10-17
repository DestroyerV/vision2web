"use client";

import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  minimal?: boolean;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  minimal = false,
}: ErrorFallbackProps) {
  if (minimal) {
    return (
      <div className="flex items-center justify-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="space-y-3">
            <p className="text-sm">
              {error?.message || "An unexpected error occurred"}
            </p>
            {resetErrorBoundary && (
              <Button
                onClick={resetErrorBoundary}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCcw className="w-3 h-3" />
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Error Icon */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 dark:bg-destructive/20">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Something went wrong
          </h2>
          <p className="text-muted-foreground">
            We encountered an unexpected error while loading this content.
          </p>
        </div>

        {/* Error Details */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription>
              <p className="text-sm">{error.message}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {resetErrorBoundary && (
            <Button
              onClick={resetErrorBoundary}
              size="lg"
              className="w-full sm:w-auto gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
          )}
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
      </div>
    </div>
  );
}
