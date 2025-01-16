import { defineMessages } from "react-intl";
export const meetingTypeMessages = defineMessages({
  ordinary: {
    id: "generalMeeting.meetingType.ordinary",
    defaultMessage: "Ordinary",
  },
  extraordinary: {
    id: "generalMeeting.meetingType.extraordinary",
    defaultMessage: "Extraordinary",
  },
  mixte: {
    id: "generalMeeting.meetingType.mixte",
    defaultMessage: "Mixed",
  },
  special: {
    id: "generalMeeting.meetingType.special",
    defaultMessage: "Special",
  },
});

export const statusMessages = defineMessages({
  pending: {
    id: "generalMeeting.status.pending",
    defaultMessage: "In preparation",
  },
  closed: {
    id: "generalMeeting.status.closed",
    defaultMessage: "Closed",
  },
});

export const fileTypeMessages = defineMessages({
  convocation: {
    id: "generalMeeting.fileType.convocation",
    defaultMessage: "Convocation",
  },
  agenda: {
    id: "generalMeeting.fileType.agenda",
    defaultMessage: "Agenda",
  },
  pv: {
    id: "generalMeeting.fileType.pv",
    defaultMessage: "Minutes",
  },
  attendance_list: {
    id: "generalMeeting.fileType.attendance_list",
    defaultMessage: "Attendance list",
  },
  other: {
    id: "generalMeeting.fileType.other",
    defaultMessage: "Other file",
  },
});

export const fileTypes = [
  {
    value: "convocation",
    label: "Convocation",
  },
  {
    value: "agenda",
    label: "Ordre du jour",
  },
  {
    value: "pv",
    label: "Procès-verbal",
  },
  {
    value: "attendance_list",
    label: "Liste de présence",
  },
  {
    value: "other",
    label: "Autre fichier",
  },
];
export const getMeetingTypes = (intl) => [
  {
    value: "ordinary",
    label: intl.formatMessage(meetingTypeMessages.ordinary),
  },
  {
    value: "extraordinary",
    label: intl.formatMessage(meetingTypeMessages.extraordinary),
  },
  {
    value: "mixte",
    label: intl.formatMessage(meetingTypeMessages.mixte),
  },
  {
    value: "special",
    label: intl.formatMessage(meetingTypeMessages.special),
  },
];

export const getFileTypes = (intl) => [
  {
    value: "convocation",
    label: intl.formatMessage(fileTypeMessages.convocation),
  },
  {
    value: "agenda",
    label: intl.formatMessage(fileTypeMessages.agenda),
  },
  {
    value: "pv",
    label: intl.formatMessage(fileTypeMessages.pv),
  },
  {
    value: "attendance_list",
    label: intl.formatMessage(fileTypeMessages.attendance_list),
  },
  {
    value: "other",
    label: intl.formatMessage(fileTypeMessages.other),
  },
];
