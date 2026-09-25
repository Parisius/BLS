"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";

/** A collaborator profile ("position"): a job type that evaluation criteria are attached to. */
export interface Profile {
  id: string;
  title: string;
}

export async function getAllProfiles(): Promise<Profile[]> {
  return unwrap(await apiClient.GET("/positions")).map((item) => ({ id: item.id!, title: item.title ?? "" }));
}

export async function createProfile(args: { title: string }): Promise<Profile> {
  const item = unwrap(await apiClient.POST("/positions", { body: { title: args.title } }));
  return { id: item.id!, title: item.title ?? "" };
}

export async function updateProfile(profileId: string, args: { title: string }) {
  unwrap(
    await apiClient.PUT("/positions/{profileId}", { params: { path: { profileId } }, body: { title: args.title } }),
  );
}

export async function deleteProfile(profileId: string) {
  const { error } = await apiClient.DELETE("/positions/{profileId}", { params: { path: { profileId } } });
  throwIfError(error, "Failed to delete the profile");
}
