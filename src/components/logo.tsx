import { Printer } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2 font-bold text-lg text-primary">
      <Printer className="h-6 w-6" />
      <span className="group-data-[collapsible=icon]:hidden">StockPilot</span>
    </div>
  );
}
