"use client";

import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#22c55e",
          colorBackground: "#0f172a",
          colorInputBackground: "#1e293b",
          colorInputText: "#f8fafc",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
