import { createFileRoute } from "@tanstack/react-router";
import { DirectoryManager } from "@/components/admin/DirectoryManager";

export const Route = createFileRoute("/_authed/admin/murtikars")({ component: MurtikarsAdmin });

function MurtikarsAdmin() {
  return (
    <DirectoryManager
      entityName="Murtikar"
      title="Murtikars"
      noun="Murtikar"
      description="Idol makers and workshops. Only published profiles appear on the public directory."
    />
  );
}