export const incidentCategories = [
  {
    value: "avis-tiers-detenteurs",
    label: "Traitement des avis à tiers détenteur",
  },
  {
    value: "requisition",
    label: "Traitement des réquisitions",
  },
  {
    value: "saisie-conservatoire",
    label: "Traitement des saisies conservatoires",
  },
  {
    value: "saisie-attribution",
    label: "Traitement des saisies attribution",
  },
];

export const getIncidentCategories = (intl) => [
  {
    value: "avis-tiers-detenteurs",
    label: intl.formatMessage({
      id: "incident.incident.categories.avisTiersDetenteur",
    }),
  },
  {
    value: "requisition",
    label: intl.formatMessage({
      id: "incident.incident.categories.requisition",
    }),
  },
  {
    value: "saisie-conservatoire",
    label: intl.formatMessage({
      id: "incident.incident.categories.saisieConservatoire",
    }),
  },
  {
    value: "saisie-attribution",
    label: intl.formatMessage({
      id: "incident.incident.categories.saisieAttribution",
    }),
  },
];
