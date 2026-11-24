import { createFileRoute } from "@tanstack/react-router";
import { DirectoryManager } from "@/components/admin/DirectoryManager";

export const Route = createFileRoute("/_authed/admin/dhol-tasha")({ component: DholAdmin });

function DholAdmin() {
  return (
    <DirectoryManager
      entityName="DholTasha"
      title="Dhol-Tasha Groups"
      noun="Group"
      description="Performance troupes. Only published groups appear on the public directory."
    />
  );
}