"use client";
export const recoveryTypes = [
  {
    value: "friendly_without_guarantee",
    label: "Amiable sans garantie",
  },
  {
    value: "friendly_with_guarantee",
    label: "Amiable avec garantie",
  },
  {
    value: "forced_without_guarantee",
    label: "Forcé sans garantie",
  },
  {
    value: "forced_with_guarantee",
    label: "Forcé avec garantie",
  },
];

import { useIntl } from "react-intl";

export const useRecoveryTypes = () => {
  const intl = useIntl();

  return [
    {
      value: "friendly_without_guarantee",
      label: intl.formatMessage({ id: "recovery.friendlyWithoutGuarantee" }),
    },
    {
      value: "friendly_with_guarantee",
      label: intl.formatMessage({ id: "recovery.friendlyWithGuarantee" }),
    },
    {
      value: "forced_without_guarantee",
      label: intl.formatMessage({ id: "recovery.forcedWithoutGuarantee" }),
    },
    {
      value: "forced_with_guarantee",
      label: intl.formatMessage({ id: "recovery.forcedWithGuarantee" }),
    },
  ];
};
