import {
  meetingTypeMessages,
  statusMessages,
} from "@/services/api-sdk/types/general-meeting";
export const STATUS_COLORS = {
  pending: "hsl(147 100% 35%)",
  closed: "rgb(107 114 128)",
};

// lib/governance/general-meeting/index.js
export const formatStatus = (status, intl) => {
  switch (status) {
    case "pending":
      return {
        status: "pending",
        label: intl.formatMessage(statusMessages.pending),
        color: STATUS_COLORS.pending,
      };
    case "closed":
      return {
        status: "closed",
        label: intl.formatMessage(statusMessages.closed),
        color: STATUS_COLORS.closed,
      };
    default:
      return {
        status,
        label: intl.formatMessage(statusMessages.closed),
        color: STATUS_COLORS.closed,
      };
  }
};
export const formatMeetingType = (type, intl) => {
  return {
    value: type,
    label: intl.formatMessage(meetingTypeMessages[type]),
  };
};
