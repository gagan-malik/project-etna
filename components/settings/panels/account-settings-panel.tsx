"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { SettingsSection } from "../settings-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle, LogOut, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { isPaidPlan } from "../settings-config";
import { useUserSettings } from "@/components/user-settings-provider";
import { cn } from "@/lib/utils";

const SUPPORT_EMAIL = "hi@projectetna.com";

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
}

function AccountRow({
  label,
  value,
  action,
  description,
}: {
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        {label && (
          <Label className="text-sm font-medium text-foreground">
            {label}
          </Label>
        )}
        <div className="mt-1 text-sm text-muted-foreground">{value}</div>
        {description && (
          <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function AccountSettingsPanel() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { toast } = useToast();
  const { plan } = useUserSettings();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [fullNameOpen, setFullNameOpen] = useState(false);
  const [usernameOpen, setUsernameOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [deleteConfirmPhrase, setDeleteConfirmPhrase] = useState("");
  const [signOutAllOpen, setSignOutAllOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");

  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const phone =
    (user as { primaryPhoneNumber?: { phoneNumber?: string } } | null)?.primaryPhoneNumber?.phoneNumber ?? "";
  const displayUsername =
    username.trim() || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || user?.fullName || "—";
  const handleDisplay =
    !displayUsername || displayUsername === "—"
      ? "—"
      : displayUsername.startsWith("@")
        ? displayUsername
        : `@${displayUsername}`;

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setUsername("");
      setEditName(user.fullName || "");
      setEditUsername(user.primaryEmailAddress?.emailAddress?.split("@")[0] || user.fullName || "");
    }
  }, [user]);

  const planLabel = plan ?? "free";
  const planDisplay =
    planLabel === "pro"
      ? "Pro"
      : planLabel === "ultra"
        ? "Ultra"
        : planLabel === "enterprise"
          ? "Enterprise"
          : planLabel === "free"
            ? "Free"
            : `${String(planLabel).charAt(0).toUpperCase()}${String(planLabel).slice(1)}`;
  const isPaid = isPaidPlan(planLabel);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      router.refresh();
      setName(editName);
      setFullNameOpen(false);
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editUsername }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update username");
      }

      router.refresh();
      setUsername(editUsername);
      setUsernameOpen(false);
      toast({ title: "Success", description: "Username updated successfully" });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update username",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/account/delete", { method: "DELETE" });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete account");
      }

      toast({ title: "Account deleted", description: "Your account has been deleted" });
      setDeleteOpen(false);
      router.push("/login");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutAll = () => {
    signOut({ redirectUrl: "/login" });
    setSignOutAllOpen(false);
  };

  return (
    <div className="w-full px-8 pt-16 pb-5 space-y-6">
      {/* Account */}
      <SettingsSection title="Account" list>
        <AccountRow
          label="Profile"
          value={
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.imageUrl || undefined} alt="" />
                <AvatarFallback className="text-sm">
                  {getInitials(user?.fullName ?? undefined)}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">
                {user?.fullName || displayUsername || "—"}
              </span>
            </div>
          }
          action={
            <Button variant="secondary" size="sm" onClick={() => setAvatarOpen(true)}>
              Edit
            </Button>
          }
        />
        <AccountRow
          label="Email"
          value={email || "—"}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast({ title: "Edit email", description: "Update your email via your account provider (e.g. Clerk dashboard)." })}
              aria-label="Edit email"
            >
              Edit
            </Button>
          }
        />
        <AccountRow
          label="Phone"
          value={phone || "—"}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast({ title: "Edit phone", description: "Update your phone via your account provider (e.g. Clerk dashboard)." })}
              aria-label="Edit phone"
            >
              Edit
            </Button>
          }
        />
        <AccountRow
          label="Handle"
          value={handleDisplay}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setUsernameOpen(true)}
              aria-label="Edit handle"
            >
              Edit
            </Button>
          }
        />
      </SettingsSection>

      {/* System — only when authenticated */}
      {user != null && (
        <SettingsSection title="System" list>
          <AccountRow
            label=""
            value={`You are signed in as ${user.fullName || displayUsername || "—"}`}
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => signOut({ redirectUrl: "/login" })}
                className="gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            }
          />
          <AccountRow
            label="Sign out of all sessions"
            value={null}
            description="Devices or browsers where you are signed in"
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSignOutAllOpen(true)}
              >
                Sign out of all sessions
              </Button>
            }
          />
          <AccountRow
            label="Support"
            value={null}
            action={
              <Button variant="secondary" size="sm" onClick={() => setContactOpen(true)}>
                Contact
              </Button>
            }
          />
        </SettingsSection>
      )}

      {/* Danger Zone — only when authenticated */}
      {user != null && (
        <SettingsSection title="Danger Zone">
          <AccountRow
            label="Delete account"
            value={null}
            description="Permanently delete your account and data"
            action={
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                className="gap-1.5"
              >
                <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                Delete account
              </Button>
            }
          />
        </SettingsSection>
      )}

      {/* Dialogs */}
      <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Change avatar</DialogTitle>
            <DialogDescription id="avatar-desc">
              Avatar upload is not yet implemented. You can update your profile picture
              via your identity provider (e.g. Google, GitHub) or contact support.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAvatarOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={fullNameOpen} onOpenChange={setFullNameOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Change full name</DialogTitle>
            <DialogDescription id="fullname-desc">
              Update the name displayed on your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor="dialog-fullname">Full name</Label>
            <Input
              id="dialog-fullname"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setFullNameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} disabled={loading}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={usernameOpen} onOpenChange={setUsernameOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Change username</DialogTitle>
            <DialogDescription id="username-desc">
              Your username is used in the app. It may be derived from your email or
              profile name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor="dialog-username">Username</Label>
            <Input
              id="dialog-username"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setUsernameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUsername} disabled={loading}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Contact support</DialogTitle>
            <DialogDescription id="contact-desc">
              For support, billing, and general assistance, email us at:
            </DialogDescription>
          </DialogHeader>
          <p className="py-2">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-primary underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
          <DialogFooter>
            <Button onClick={() => setContactOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={signOutAllOpen} onOpenChange={setSignOutAllOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Sign out of all sessions</DialogTitle>
            <DialogDescription id="signout-all-desc">
              You will be signed out on this device and any other device or browser
              where you are currently signed in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSignOutAllOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSignOutAll}>
              Sign out of all sessions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) {
            setDeleteConfirmEmail("");
            setDeleteConfirmPhrase("");
          }
        }}
      >
        <DialogContent className="sm:max-w-lg gap-4 p-6" aria-describedby="delete-desc">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-lg">Delete account</DialogTitle>
            <DialogDescription id="delete-desc" className="text-sm text-muted-foreground">
              This will permanently delete your account and related resources like your data and
              preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="delete-confirm-email" className="text-sm font-normal">
                To confirm, type &quot;{email || "my-account"}&quot;
              </Label>
              <Input
                id="delete-confirm-email"
                type="text"
                value={deleteConfirmEmail}
                onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                placeholder={`Type "${email || "my-account"}"`}
                autoComplete="off"
                aria-invalid={!!(deleteConfirmEmail && deleteConfirmEmail !== (email || "my-account"))}
                className={cn(
                  deleteConfirmEmail &&
                    deleteConfirmEmail !== (email || "my-account") &&
                  "border-destructive focus-visible:ring-destructive"
                )}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="delete-confirm-phrase" className="text-sm font-normal">
                To confirm, type &quot;delete my account&quot;
              </Label>
              <Input
                id="delete-confirm-phrase"
                type="text"
                value={deleteConfirmPhrase}
                onChange={(e) => setDeleteConfirmPhrase(e.target.value)}
                placeholder='Type "delete my account"'
                autoComplete="off"
                aria-invalid={!!(deleteConfirmPhrase && deleteConfirmPhrase !== "delete my account")}
                className={cn(
                  deleteConfirmPhrase &&
                    deleteConfirmPhrase !== "delete my account" &&
                  "border-destructive focus-visible:ring-destructive"
                )}
              />
            </div>
            <Alert variant="destructive" className="rounded-md">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Deleting your account cannot be undone.</AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={
                loading ||
                deleteConfirmEmail !== (email || "my-account") ||
                deleteConfirmPhrase !== "delete my account"
              }
            >
              Delete account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
