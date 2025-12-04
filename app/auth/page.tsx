"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Mail, Lock, User } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    router.push("/chat");
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    router.push("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--colours-background-bg-page-primary)] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-[var(--radius-full)] bg-[var(--colours-background-bg-quaternary)] flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-[var(--colours-text-text-secondary-700)]" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--colours-text-text-primary-900)] mb-2">
            AI Chat
          </h1>
          <p className="text-sm text-[var(--colours-text-text-tertiary-600)]">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        {/* Auth Card */}
        <Card className="bg-[var(--component-colors-utility-gray-utility-gray-100)] border-[var(--colours-border-border-primary)]">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-[var(--colours-text-text-primary-900)] text-center">
              Authentication
            </CardTitle>
            <CardDescription className="text-center text-[var(--colours-text-text-tertiary-600)]">
              Choose your preferred authentication method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-[var(--colours-background-bg-page-primary)]">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-[var(--colours-background-bg-active)] data-[state=active]:text-[var(--colours-text-text-primary-900)]"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-[var(--colours-background-bg-active)] data-[state=active]:text-[var(--colours-text-text-primary-900)]"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="login-email" 
                      className="text-[var(--colours-text-text-secondary-700)]"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--colours-text-text-tertiary-600)]" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        className="pl-10 bg-[var(--colours-background-bg-page-primary)] border-[var(--colours-border-border-primary)] text-[var(--colours-text-text-primary-900)] placeholder:text-[var(--colours-text-text-tertiary-600)]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label 
                      htmlFor="login-password" 
                      className="text-[var(--colours-text-text-secondary-700)]"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--colours-text-text-tertiary-600)]" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        className="pl-10 bg-[var(--colours-background-bg-page-primary)] border-[var(--colours-border-border-primary)] text-[var(--colours-text-text-primary-900)] placeholder:text-[var(--colours-text-text-tertiary-600)]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-[var(--colours-border-border-primary)] bg-[var(--colours-background-bg-page-primary)]"
                      />
                      <span className="text-sm text-[var(--colours-text-text-tertiary-600)]">
                        Remember me
                      </span>
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-sm text-[var(--component-colors-components-buttons-tertiary-color-button-tertiary-color-fg)] hover:text-[var(--colours-text-text-secondary-700)] p-0 h-auto"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[var(--component-colors-components-buttons-primary-button-primary-bg)] text-[var(--component-colors-components-buttons-primary-button-primary-fg)] hover:bg-[var(--component-colors-components-buttons-primary-button-primary-bg_hover)]"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="signup-name" 
                      className="text-[var(--colours-text-text-secondary-700)]"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--colours-text-text-tertiary-600)]" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        required
                        className="pl-10 bg-[var(--colours-background-bg-page-primary)] border-[var(--colours-border-border-primary)] text-[var(--colours-text-text-primary-900)] placeholder:text-[var(--colours-text-text-tertiary-600)]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label 
                      htmlFor="signup-email" 
                      className="text-[var(--colours-text-text-secondary-700)]"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--colours-text-text-tertiary-600)]" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        className="pl-10 bg-[var(--colours-background-bg-page-primary)] border-[var(--colours-border-border-primary)] text-[var(--colours-text-text-primary-900)] placeholder:text-[var(--colours-text-text-tertiary-600)]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label 
                      htmlFor="signup-password" 
                      className="text-[var(--colours-text-text-secondary-700)]"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--colours-text-text-tertiary-600)]" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        required
                        className="pl-10 bg-[var(--colours-background-bg-page-primary)] border-[var(--colours-border-border-primary)] text-[var(--colours-text-text-primary-900)] placeholder:text-[var(--colours-text-text-tertiary-600)]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label 
                      htmlFor="signup-confirm-password" 
                      className="text-[var(--colours-text-text-secondary-700)]"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--colours-text-text-tertiary-600)]" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        required
                        className="pl-10 bg-[var(--colours-background-bg-page-primary)] border-[var(--colours-border-border-primary)] text-[var(--colours-text-text-primary-900)] placeholder:text-[var(--colours-text-text-tertiary-600)]"
                      />
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 rounded border-[var(--colours-border-border-primary)] bg-[var(--colours-background-bg-page-primary)]"
                    />
                    <label 
                      htmlFor="terms" 
                      className="text-sm text-[var(--colours-text-text-tertiary-600)] cursor-pointer"
                    >
                      I agree to the{" "}
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-sm text-[var(--component-colors-components-buttons-tertiary-color-button-tertiary-color-fg)] hover:text-[var(--colours-text-text-secondary-700)] p-0 h-auto underline"
                      >
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-sm text-[var(--component-colors-components-buttons-tertiary-color-button-tertiary-color-fg)] hover:text-[var(--colours-text-text-secondary-700)] p-0 h-auto underline"
                      >
                        Privacy Policy
                      </Button>
                    </label>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[var(--component-colors-components-buttons-primary-button-primary-bg)] text-[var(--component-colors-components-buttons-primary-button-primary-fg)] hover:bg-[var(--component-colors-components-buttons-primary-button-primary-bg_hover)]"
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Additional Options */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--colours-text-text-tertiary-600)]">
            Or continue with
          </p>
          <div className="mt-4 flex gap-3 justify-center">
            <Button
              variant="outline"
              className="flex-1 max-w-[140px] border-[var(--colours-border-border-primary)] bg-[var(--colours-background-bg-page-primary)] hover:bg-[var(--component-colors-utility-gray-utility-gray-100)]"
            >
              Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 max-w-[140px] border-[var(--colours-border-border-primary)] bg-[var(--colours-background-bg-page-primary)] hover:bg-[var(--component-colors-utility-gray-utility-gray-100)]"
            >
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
