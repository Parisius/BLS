import { defineMessages } from "react-intl";

export const meetingTypes = [
  {
    value: "first_quarter",
    label: "1er trimestre",
  },
  {
    value: "second_quarter",
    label: "2e trimestre",
  },
  {
    value: "third_quarter",
    label: "3e trimestre",
  },
  {
    value: "fourth_quarter",
    label: "4e trimestre",
  },
];
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

export const boardMeetingTypes = [
  {
    value: "first_quarter",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.meeting.type.first_quarter",
        defaultMessage: "1er trimestre",
      },
    }).label,
  },
  {
    value: "second_quarter",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.meeting.type.second_quarter",
        defaultMessage: "2e trimestre",
      },
    }).label,
  },
  {
    value: "third_quarter",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.meeting.type.third_quarter",
        defaultMessage: "3e trimestre",
      },
    }).label,
  },
  {
    value: "fourth_quarter",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.meeting.type.fourth_quarter",
        defaultMessage: "4e trimestre",
      },
    }).label,
  },
];

export const boardFileTypes = [
  {
    value: "convocation",
    label: defineMessages({
      label: {
        id: "file.type.convocation",
        defaultMessage: "Convocation",
      },
    }).label,
  },
  {
    value: "agenda",
    label: defineMessages({
      label: {
        id: "file.type.agenda",
        defaultMessage: "Ordre du jour",
      },
    }).label,
  },
  {
    value: "pv",
    label: defineMessages({
      label: {
        id: "file.type.pv",
        defaultMessage: "Procès-verbal",
      },
    }).label,
  },
  {
    value: "attendance_list",
    label: defineMessages({
      label: {
        id: "file.type.attendance_list",
        defaultMessage: "Liste de présence",
      },
    }).label,
  },
  {
    value: "other",
    label: defineMessages({
      label: {
        id: "file.type.other",
        defaultMessage: "Autre fichier",
      },
    }).label,
  },
];
