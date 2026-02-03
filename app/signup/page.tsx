import { SignupForm } from "@/components/signup-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}

