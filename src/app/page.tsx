import DashboardClient from "./_components/dashboard-client";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your cartridge inventory.
        </p>
      </header>
      <DashboardClient />
    </div>
  );
}
