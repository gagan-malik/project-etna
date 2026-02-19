"use client";

import { SettingsSection } from "../settings-section";

const SUPPORT_EMAIL = "hi@projectetna.com";

export function ContactUsPanel() {
  return (
    <div className="w-full px-8 pt-16 pb-5 space-y-6">
      <SettingsSection title="Contact Us">
        <p className="text-sm text-muted-foreground">
          For all support inquiries, including billing issues, receipts, and
          general assistance, please email{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </SettingsSection>
    </div>
  );
}
