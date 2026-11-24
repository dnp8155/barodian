import { createFileRoute } from "@tanstack/react-router";
import { DirectoryManager } from "@/components/admin/DirectoryManager";

export const Route = createFileRoute("/_authed/admin/dj")({ component: DjAdmin });

function DjAdmin() {
  return (
    <DirectoryManager
      entityName="DjService"
      title="DJ Services"
      noun="Provider"
      description="Sound, light and music providers. Only published providers appear on the public directory."
    />
  );
}