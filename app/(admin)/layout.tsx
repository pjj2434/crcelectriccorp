// app/dashboard/layout.tsx



import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await auth.api.getSession({
    headers: await headers()
  });
    
  // Redirect to login if not authenticated
  if (!data || !data.session) {
    // Redirect to the login page
    redirect("/login");
  }

  return (
    <div className="">
      
            {children}
         
    </div>
  );
}