"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllMeetings,
  getOneMeeting,
  createMeeting,
  updateMeeting,
  type MeetingStatus,
} from "./meetings";
import {
  getAllMeetingTasks,
  createMeetingTask,
  updateMeetingTask,
  markMeetingTaskAsCompleted,
  forwardMeetingTask,
  deleteMeetingTask,
  updateChecklistTasksStatus,
  type MeetingTaskType,
} from "./tasks";
import {
  getAllAttendants,
  updateAttendance,
  addAttendant,
  updateAttendant,
  deleteAttendant,
  type Attendant,
} from "./attendance";
import { addMeetingFile, type MeetingFileType } from "./files";
import {
  getAllDirectors,
  createDirector,
  updateDirector,
  deleteDirector,
  type DirectorFormArgs,
} from "./directors";
import { updateMandate, renewMandate } from "./mandates";

// ---- users (for forward recipients) ----
export { useAllUsers as useAllMeetingUsers } from "@/lib/administration/hooks";

// ---- meetings ----

const MEETINGS_KEY = ["governance", "managementCommittee", "meetings"];
const oneMeetingKey = (meetingId: string) => [...MEETINGS_KEY, meetingId];

export const useAllMeetings = (status: MeetingStatus) =>
  useQuery({ queryKey: [...MEETINGS_KEY, status], queryFn: () => getAllMeetings(status) });

export const useOneMeeting = (meetingId: string) =>
  useQuery({ queryKey: oneMeetingKey(meetingId), queryFn: () => getOneMeeting(meetingId) });

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMeeting,
    onSettled: () => queryClient.invalidateQueries({ queryKey: MEETINGS_KEY }),
  });
};

export const useUpdateMeeting = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof updateMeeting>[1]) => updateMeeting(meetingId, args),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: oneMeetingKey(meetingId) });
      return queryClient.invalidateQueries({ queryKey: MEETINGS_KEY });
    },
  });
};

// ---- tasks ----

const tasksKey = (meetingId: string, type: MeetingTaskType) => [
  "governance",
  "managementCommittee",
  "tasks",
  meetingId,
  type,
];

export const useAllMeetingTasks = (meetingId: string, type: MeetingTaskType = "task") =>
  useQuery({ queryKey: tasksKey(meetingId, type), queryFn: () => getAllMeetingTasks(meetingId, type) });

export const useCreateMeetingTask = (meetingId: string, type: MeetingTaskType = "task") => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof createMeetingTask>[1]) => createMeetingTask(meetingId, args, type),
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey(meetingId, type) }),
  });
};

export const useUpdateMeetingTask = (meetingId: string, taskId: string, type: MeetingTaskType = "task") => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof updateMeetingTask>[1]) => updateMeetingTask(taskId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey(meetingId, type) }),
  });
};

export const useMarkMeetingTaskAsCompleted = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => markMeetingTaskAsCompleted(taskId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey(meetingId, "task") }),
  });
};

export const useForwardMeetingTask = (meetingId: string, taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof forwardMeetingTask>[1]) => forwardMeetingTask(taskId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey(meetingId, "task") }),
  });
};

export const useDeleteMeetingTask = (meetingId: string, type: MeetingTaskType = "task") => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMeetingTask,
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey(meetingId, type) }),
  });
};

export const useUpdateChecklistTasksStatus = (meetingId: string, type: MeetingTaskType) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateChecklistTasksStatus,
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKey(meetingId, type) }),
  });
};

// ---- attendance ----

const attendanceKey = (meetingId: string) => ["governance", "managementCommittee", "attendance", meetingId];

export const useAllAttendants = (meetingId: string) =>
  useQuery({ queryKey: attendanceKey(meetingId), queryFn: () => getAllAttendants(meetingId) });

export const useUpdateAttendance = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attendants: Attendant[]) => updateAttendance(meetingId, attendants),
    onSettled: () => queryClient.invalidateQueries({ queryKey: attendanceKey(meetingId) }),
  });
};

export const useAddAttendant = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof addAttendant>[1]) => addAttendant(meetingId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: attendanceKey(meetingId) }),
  });
};

export const useUpdateAttendant = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attendantId, ...args }: { attendantId: string } & Parameters<typeof updateAttendant>[1]) =>
      updateAttendant(attendantId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: attendanceKey(meetingId) }),
  });
};

export const useDeleteAttendant = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttendant,
    onSettled: () => queryClient.invalidateQueries({ queryKey: attendanceKey(meetingId) }),
  });
};

// ---- files ----

export const useAddMeetingFile = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { file: File; type: MeetingFileType }) => addMeetingFile(meetingId, args.file, args.type),
    onSettled: () => queryClient.invalidateQueries({ queryKey: oneMeetingKey(meetingId) }),
  });
};

// ---- directors ----

const DIRECTORS_KEY = ["governance", "managementCommittee", "directors"];

export const useAllDirectors = () =>
  useQuery({ queryKey: DIRECTORS_KEY, queryFn: getAllDirectors });

export const useCreateDirector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDirector,
    onSettled: () => queryClient.invalidateQueries({ queryKey: DIRECTORS_KEY }),
  });
};

export const useUpdateDirector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ directorId, ...args }: { directorId: string } & DirectorFormArgs) =>
      updateDirector(directorId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: DIRECTORS_KEY }),
  });
};

export const useDeleteDirector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDirector,
    onSettled: () => queryClient.invalidateQueries({ queryKey: DIRECTORS_KEY }),
  });
};

// ---- mandates ----

export const useUpdateMandate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mandateId, startDate }: { mandateId: string; startDate: string }) =>
      updateMandate(mandateId, startDate),
    onSettled: () => queryClient.invalidateQueries({ queryKey: DIRECTORS_KEY }),
  });
};

export const useRenewMandate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ directorId, startDate }: { directorId: string; startDate: string }) =>
      renewMandate(directorId, startDate),
    onSettled: () => queryClient.invalidateQueries({ queryKey: DIRECTORS_KEY }),
  });
};
