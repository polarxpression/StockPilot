"use client";

import { RootLayout } from "@/components/layout/root-layout";
import DashboardClient from "@/components/dashboard/dashboard-client";

interface PageProps {
  pathname: string;
}

export function DashboardPage({ pathname }: PageProps) {
  return (
    <RootLayout pathname={pathname}>
      <DashboardClient />
    </RootLayout>
  );
}
