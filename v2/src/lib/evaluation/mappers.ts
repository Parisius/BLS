import type { components } from "@/lib/api/schema";

type CollaboratorResponse = components["schemas"]["Collaborator"];

export interface Collaborator {
  id: string;
  firstname: string;
  lastname: string;
  profile: { id: string; title: string };
}

export const mapCollaborator = (item?: CollaboratorResponse): Collaborator => ({
  id: item?.id ?? "",
  firstname: item?.firstname ?? "",
  lastname: item?.lastname ?? "",
  profile: { id: item?.position?.id ?? "", title: item?.position?.title ?? "" },
});
