"use client";

import { NavigationProvider, useNavigation } from "@/components/navigation-context";
import PageLoader from "@/components/page-loader";

function AppContent({ children }: { children: React.ReactNode }) {
  const { isNavigating, navigationText } = useNavigation();
  
  return (
    <>
      <div className="relative">
        {children}
      </div>
      <PageLoader isLoading={isNavigating} text={navigationText} />
    </>
  );
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <AppContent>{children}</AppContent>
    </NavigationProvider>
  );
}