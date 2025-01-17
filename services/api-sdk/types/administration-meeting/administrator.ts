import { defineMessages } from "react-intl";

export const administratorQualities = [
  {
    value: "shareholder",
    label: "Actionnaire",
  },
  {
    value: "non_shareholder",
    label: "Non actionnaire",
  },
];
export const administratorRoles = [
  {
    value: "ca_president",
    label: "Président du conseil d'administration",
  },
  {
    value: "ca_executive_admin",
    label: "Administrateur exécutif",
  },
  {
    value: "ca_non_executive_admin",
    label: "Administrateur non exécutif",
  },
  {
    value: "ca_independent_admin",
    label: "Administrateur indépendant",
  },
];
export const administratorTypes = [
  {
    value: "individual",
    label: "Personne physique",
  },
  {
    value: "corporate",
    label: "Personne morale",
  },
];
export const administratorQualitiesItnl = [
  {
    value: "shareholder",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.administrator.quality.shareholder",
        defaultMessage: "Actionnaire",
      },
    }).label,
  },
  {
    value: "non_shareholder",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.administrator.quality.non_shareholder",
        defaultMessage: "Non actionnaire",
      },
    }).label,
  },
];

export const administratorRolesItnl = [
  {
    value: "ca_president",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.administrator.role.ca_president",
        defaultMessage: "Président du conseil d'administration",
      },
    }).label,
  },
  {
    value: "ca_executive_admin",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.administrator.role.ca_executive_admin",
        defaultMessage: "Administrateur exécutif",
      },
    }).label,
  },
  {
    value: "ca_non_executive_admin",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.administrator.role.ca_non_executive_admin",
        defaultMessage: "Administrateur non exécutif",
      },
    }).label,
  },
  {
    value: "ca_independent_admin",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.administrator.role.ca_independent_admin",
        defaultMessage: "Administrateur indépendant",
      },
    }).label,
  },
];

export const administratorTypesItnl = [
  {
    value: "individual",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.administrator.type.individual",
        defaultMessage: "Personne physique",
      },
    }).label,
  },
  {
    value: "corporate",
    label: defineMessages({
      label: {
        id: "sessionAdministrator.administrator.type.corporate",
        defaultMessage: "Personne morale",
      },
    }).label,
  },
];
