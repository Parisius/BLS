"use server";

import { apiClient, throwIfError } from "@/lib/api/client";

export type MeetingFileType = "convocation" | "agenda" | "pv" | "attendance_list" | "other";

export async function addMeetingFile(meetingId: string, file: File, type: MeetingFileType) {
  const formData = new FormData();
  formData.append("session_administrator_id", meetingId);
  formData.append("files[0][file]", file);
  formData.append("files[0][type]", type);

  const { error } = await apiClient.POST("/ca_attachements", { body: formData as never });
  throwIfError(error, "Failed to upload the file");
}
