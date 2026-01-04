import "../globals.css";
import { Navbar } from "@/components/navbar-server";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Footer from "@/components/layout/Footer";

export default function WithNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen w-full pt-14">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex-1 w-full overflow-hidden sm:rounded-tl-2xl bg-content-bg">
            <div className="flex flex-1 flex-col w-full overflow-y-auto min-h-full">
              {children}
              <Footer />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
