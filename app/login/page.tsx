import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"

function LoginFormWrapper() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 md:p-8">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 md:p-8">
        <div className="w-full max-w-sm md:max-w-3xl">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    }>
      <LoginFormWrapper />
    </Suspense>
  )
}
