"use client";

import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useCurrentTheme } from "@/hooks/use-current-theme";

export default function UserControl({ showName }: { showName?: boolean }) {
  const currentTheme = useCurrentTheme();

  return (
    <UserButton
      showName={showName}
      appearance={{
        elements: {
          userButtonBox: "rounded-full!",
          userButtonAvatarBox: "rounded-full! size-8!",
          userButtonTrigger: "rounded-full!",
        },
        theme: currentTheme === "dark" ? dark : undefined,
      }}
    />
  );
}
