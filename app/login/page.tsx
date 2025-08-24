import SignIn from "@/components/login-form"
import { Toaster } from "sonner"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page() {
  // Check if user is already authenticated
  const data = await auth.api.getSession({
    headers: await headers()
  });
    
  // If user is already logged in, redirect to admin service page
  if (data && data.session) {
    redirect("/service");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignIn />
      </div>
      <Toaster/>
    </div>
  )
}
