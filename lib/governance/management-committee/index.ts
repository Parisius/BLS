export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return {
        status: "pending",
        label: "En cours de préparation",
        color: "hsl(147 100% 35%)",
      };
    case "closed":
      return {
        status: "closed",
        label: "Terminée",
        color: "rgb(107 114 128)",
      };
    default:
      return {
        status,
        label: "Terminée",
        color: "rgb(107 114 128)",
      };
  }
};

export const formatSt = (status, intl) => {
  switch (status) {
    case "pending":
      return {
        label: intl.formatMessage({ id: "managementCommittee.status.pending" }),
        color: "hsl(147 100% 35%)",
      };
    case "closed":
      return {
        label: intl.formatMessage({ id: "managementCommittee.status.closed" }),
        color: "rgb(107 114 128)",
      };
    default:
      return {
        label: intl.formatMessage({ id: "managementCommittee.status.closed" }),
        color: "rgb(107 114 128)",
      };
  }
};
