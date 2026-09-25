"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";

export interface Attendant {
  id: string;
  name: string;
  grade?: string;
  type: "director" | "not_director";
  attending: boolean;
}

function mapAttendant(item: { id?: string; name?: string; grade?: string; type?: string; status?: boolean }): Attendant {
  return {
    id: item.id!,
    name: item.name ?? "",
    grade: item.grade,
    type: item.type === "not_director" ? "not_director" : "director",
    attending: !!item.status,
  };
}

export async function getAllAttendants(meetingId: string) {
  const data = unwrap(
    await apiClient.GET("/list_attendance_management_committees", {
      params: { query: { management_committee_id: meetingId } },
    }),
  );
  return data.map(mapAttendant);
}

export async function updateAttendance(meetingId: string, attendants: Attendant[]) {
  const { error } = await apiClient.POST("/update_attendance_management_committees", {
    body: {
      management_committee_id: meetingId,
      directors: attendants.map((a) => ({ id: a.id, type: a.type, status: a.attending })) as never,
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
      body: { meeting_id: meetingId, name: args.name, grade: args.grade, type: "management_committee" },
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
