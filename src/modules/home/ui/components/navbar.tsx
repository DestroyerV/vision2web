"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserControl from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const isScrolled = useScroll();
  const { setTheme } = useTheme();

  return (
    <nav
      className={cn(
        "p-4 transparent fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled &&
          "bg-background/80 backdrop-blur-xl border-border shadow-sm",
      )}
    >
      <div className="px-8 mx-auto w-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="relative p-1">
              <Image
                src="/logo.svg"
                alt="Vision2Web"
                width={24}
                height={24}
                className="transition-transform group-hover:scale-110"
              />
            </div>
          </div>
          <span className="font-semibold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Vision2Web
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <SignedOut>
            <div className="flex gap-2">
              <SignUpButton>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:scale-105 transition-transform"
                >
                  Sign up
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button
                  size="sm"
                  className="rounded-full hover:scale-105 transition-transform shadow-md hover:shadow-lg"
                >
                  Sign in
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserControl showName />
          </SignedIn>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:scale-105 transition-transform"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="rounded-2xl px-2 py-2"
            >
              <DropdownMenuItem
                className="rounded-xl cursor-pointer"
                onClick={() => setTheme("light")}
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl cursor-pointer"
                onClick={() => setTheme("dark")}
              >
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl cursor-pointer"
                onClick={() => setTheme("system")}
              >
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
