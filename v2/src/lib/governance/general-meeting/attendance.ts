"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";

export interface Attendant {
  id: string;
  name: string;
  grade?: string;
  type: "shareholder" | "not_shareholder";
  attending: boolean;
}

function mapAttendant(item: { id?: string; name?: string; grade?: string; type?: string; status?: boolean }): Attendant {
  return {
    id: item.id!,
    name: item.name ?? "",
    grade: item.grade,
    type: item.type === "not_shareholder" ? "not_shareholder" : "shareholder",
    attending: !!item.status,
  };
}

export async function getAllAttendants(meetingId: string) {
  const data = unwrap(
    await apiClient.GET("/list_attendance_general_meetings", {
      params: { query: { general_meeting_id: meetingId } },
    }),
  );
  return data.map(mapAttendant);
}

export async function updateAttendance(meetingId: string, attendants: Attendant[]) {
  const { error } = await apiClient.POST("/update_attendance_general_meetings", {
    body: {
      general_meeting_id: meetingId,
      // The backend names this field after the entity being marked present
      // ("shareholders" for a general meeting), not something generic.
      shareholders: attendants.map((a) => ({ id: a.id, type: a.type, status: a.attending })) as never,
    },
  });
  throwIfError(error, "Failed to update the attendance list");
}

export interface AddAttendantArgs {
  name: string;
  grade: string;
}

export async function addAttendant(meetingId: string, args: AddAttendantArgs) {
  const data = unwrap(
    await apiClient.POST("/representants", {
      body: { meeting_id: meetingId, name: args.name, grade: args.grade, type: "general_meeting" },
    }),
  );
  return mapAttendant(data);
}

export async function updateAttendant(attendantId: string, args: AddAttendantArgs) {
  const data = unwrap(
    await apiClient.PUT("/representants/{attendantId}", {
      params: { path: { attendantId } },
      body: { name: args.name, grade: args.grade },
    }),
  );
  return mapAttendant(data);
}

export async function deleteAttendant(attendantId: string) {
  const { error } = await apiClient.DELETE("/representants/{attendantId}", {
    params: { path: { attendantId } },
  });
  throwIfError(error, "Failed to delete the attendant");
}
