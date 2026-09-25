"use server";

import { apiClient, unwrap } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import type { components } from "@/lib/api/schema";

type MeetingResponse = components["schemas"]["GeneralMeeting"];

export type MeetingType = "ordinary" | "extraordinary" | "mixte" | "special";
export type MeetingStatus = "pending" | "closed";

export interface Meeting {
  id: string;
  title: string;
  type?: MeetingType;
  reference?: string;
  meetingDate?: string;
  status: MeetingStatus;
  nextTask?: { id: string; title: string; dueDate: string };
  filesGroups: { stepName: string; files: { filename: string; fileUrl: string }[] }[];
}

function mapMeeting(item: MeetingResponse): Meeting {
  return {
    id: item.id!,
    title: item.libelle ?? "",
    type: item.type as MeetingType | undefined,
    reference: item.reference,
    meetingDate: item.meeting_date,
    status: (item.status as MeetingStatus) ?? "pending",
    nextTask: item.next_task as never,
    filesGroups: (item.files as {
      step_name?: string;
      files?: { filename?: string; file_url?: string }[];
    }[] ?? []).map((group) => ({
      stepName: group.step_name ?? "",
      files: (group.files ?? []).map((file) => ({
        filename: file.filename ?? "",
        fileUrl: file.file_url ?? "",
      })),
    })),
  };
}

export async function getAllMeetings(status: MeetingStatus) {
  const data = unwrap(await apiClient.GET("/general_meetings", { params: { query: { status } } }));
  return data.map(mapMeeting);
}

export async function getOneMeeting(meetingId: string) {
  const data = unwrap(
    await apiClient.GET("/general_meetings/{meetingId}", { params: { path: { meetingId } } }),
  );
  return mapMeeting(data);
}

export interface MeetingFormArgs {
  title: string;
  type: MeetingType;
  meetingDate: string;
}

export async function createMeeting(args: MeetingFormArgs) {
  const data = unwrap(
    await apiClient.POST("/general_meetings", {
      body: { libelle: args.title, type: args.type, meeting_date: toBackendDate(args.meetingDate) },
    }),
  );
  return mapMeeting(data);
}

export async function updateMeeting(meetingId: string, args: MeetingFormArgs) {
  const data = unwrap(
    await apiClient.PUT("/general_meetings/{meetingId}", {
      params: { path: { meetingId } },
      body: { libelle: args.title, type: args.type, meeting_date: toBackendDate(args.meetingDate) },
    }),
  );
  return mapMeeting(data);
}
