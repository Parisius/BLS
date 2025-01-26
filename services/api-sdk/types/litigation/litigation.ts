export const partyCategories = [
  {
    value: "plaintiff",
    label: "Demandeur",
  },
  {
    value: "defendant",
    label: "Défendeur",
  },
  {
    value: "intervenant",
    label: "Intervenant volontaire",
  },
  {
    value: "forced_intervenant",
    label: "Intervenant forcé",
  },
];
export const partyTypes = [
  {
    value: "client",
    label: "Client",
  },
  {
    value: "employee",
    label: "Employé",
  },
  {
    value: "provider",
    label: "Fournisseur",
  },
  {
    value: "partner",
    label: "Partenaire",
  },
];
export const getPartyCategories = (intl) => [
  {
    value: "plaintiff",
    label: intl.formatMessage({ id: "litigation.partyCategories.plaintiff" }),
  },
  {
    value: "defendant",
    label: intl.formatMessage({ id: "litigation.partyCategories.defendant" }),
  },
  {
    value: "intervenant",
    label: intl.formatMessage({ id: "litigation.partyCategories.intervenant" }),
  },
  {
    value: "forced_intervenant",
    label: intl.formatMessage({
      id: "litigation.partyCategories.forced_intervenant",
    }),
  },
];

export const getPartyTypes = (intl) => [
  {
    value: "client",
    label: intl.formatMessage({ id: "litigation.partyTypes.client" }),
  },
  {
    value: "employee",
    label: intl.formatMessage({ id: "litigation.partyTypes.employee" }),
  },
  {
    value: "provider",
    label: intl.formatMessage({ id: "litigation.partyTypes.provider" }),
  },
  {
    value: "partner",
    label: intl.formatMessage({ id: "litigation.partyTypes.partner" }),
  },
];
