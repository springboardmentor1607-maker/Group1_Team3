import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { VolunteerSidebar } from "./VolunteerSidebar";

export default function VolunteerLayout() {
  return (
    <SidebarProvider>
      <VolunteerSidebar />

      <SidebarInset className="flex flex-col min-h-screen">
        <header className="h-14 flex items-center border-b bg-card px-4 sticky top-0 z-30">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-bold">
            Volunteer Dashboard
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}