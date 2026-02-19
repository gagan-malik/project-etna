import { SpacesPanel } from "@/components/settings/panels/spaces-panel";

export default function SpacesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-10 bg-background px-6 py-4 border-b">
        <h1 className="text-lg font-semibold text-foreground">Spaces</h1>
      </div>
      <SpacesPanel />
    </div>
  );
}
