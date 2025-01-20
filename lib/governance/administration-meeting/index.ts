"use client";
import { meetingTypes } from "@/services/api-sdk/types/administration-meeting";
import { defineMessages } from "react-intl";

export const messages = defineMessages({
  statusPending: {
    id: "sessionAdministrator.status.pending",
    defaultMessage: "En cours de préparation",
  },
  statusClosed: {
    id: "sessionAdministrator.status.closed",
    defaultMessage: "Terminée",
  },
});

const statusColors = {
  pending: "hsl(147 100% 35%)",
  closed: "rgb(107 114 128)",
  default: "rgb(107 114 128)",
};

export const formatStatus = (status, intl) => {
  switch (status) {
    case "pending":
      return {
        status: "pending",
        label: intl.formatMessage(messages.statusPending),
        color: statusColors.pending,
      };
    case "closed":
      return {
        status: "closed",
        label: intl.formatMessage(messages.statusClosed),
        color: statusColors.closed,
      };
    default:
      return {
        status,
        label: intl.formatMessage(messages.statusClosed),
        color: statusColors.default,
      };
  }
};
export const formatMeetingType = (meetingType) =>
  meetingTypes.find((type) => type.value === meetingType) ?? {
    value: "first_quarter",
    label: "1er trimestre",
  };
