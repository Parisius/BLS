"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";

export interface Attendant {
  id: string;
  name: string;
  grade?: string;
  type: "administrator" | "not_administrator";
  attending: boolean;
}

function mapAttendant(item: { id?: string; name?: string; grade?: string; type?: string; status?: boolean }): Attendant {
  return {
    id: item.id!,
    name: item.name ?? "",
    grade: item.grade,
    type: item.type === "not_administrator" ? "not_administrator" : "administrator",
    attending: !!item.status,
  };
}

export async function getAllAttendants(meetingId: string) {
  const data = unwrap(
    await apiClient.GET("/list_attendance_session_administrators", {
      params: { query: { session_administrator_id: meetingId } },
    }),
  );
  return data.map(mapAttendant);
}

export async function updateAttendance(meetingId: string, attendants: Attendant[]) {
  const { error } = await apiClient.POST("/update_attendance_session_administrators", {
    body: {
      session_administrator_id: meetingId,
      administrators: attendants.map((a) => ({ id: a.id, type: a.type, status: a.attending })) as never,
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
      body: { meeting_id: meetingId, name: args.name, grade: args.grade, type: "session_administrator" },
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
