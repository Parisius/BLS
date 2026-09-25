"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { mapCollaborator } from "./mappers";

export async function getAllCollaborators(profileId?: string) {
  const data = unwrap(
    await apiClient.GET("/collaborators", { params: { query: profileId ? { position_id: profileId } : {} } }),
  );
  return data.map(mapCollaborator);
}

export interface CollaboratorArgs {
  firstname: string;
  lastname: string;
  profileId: string;
}

export async function createCollaborator(args: CollaboratorArgs) {
  return mapCollaborator(
    unwrap(
      await apiClient.POST("/collaborators", {
        body: { firstname: args.firstname, lastname: args.lastname, position_id: args.profileId },
      }),
    ),
  );
}

export async function updateCollaborator(collaboratorId: string, args: CollaboratorArgs) {
  unwrap(
    await apiClient.PUT("/collaborators/{collaboratorId}", {
      params: { path: { collaboratorId } },
      body: { firstname: args.firstname, lastname: args.lastname, position_id: args.profileId },
    }),
  );
}

export async function deleteCollaborator(collaboratorId: string) {
  const { error } = await apiClient.DELETE("/collaborators/{collaboratorId}", {
    params: { path: { collaboratorId } },
  });
  throwIfError(error, "Failed to delete the collaborator");
}
