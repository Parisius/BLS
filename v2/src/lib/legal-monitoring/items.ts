"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

type ItemResponse = components["schemas"]["LegalWatche"];

export type MailRecipient = "admin" | "personnel";
export type LegislativeType = "legislation" | "regulation";

export interface ItemMail {
  recipient: MailRecipient;
  subject: string;
  content: string;
  addresses: string[];
}

/** A judicial case or a law/regulation: both live on the same `/legal-watches` resource. */
export interface LegalItem {
  id: string;
  reference: string;
  title: string;
  summary: string;
  innovation: string;
  /** Archived items are filed away; the others were sent by mail. */
  isArchived: boolean;
  type?: string;
  /** Judicial: decision date (yyyy-MM-dd). */
  eventDate?: string;
  jurisdiction?: { id: string; title: string };
  jurisdictionLocation?: string;
  /** Legislative. */
  caseNumber?: string;
  effectiveDate?: string;
  nature?: { id: string; title: string };
  mail?: ItemMail;
}

const toDate = (value?: string) => (value ? value.slice(0, 10) : undefined);

const toAddresses = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value.split(",").map((address) => address.trim()).filter(Boolean)
      : [];

function mapItem(item: ItemResponse): LegalItem {
  return {
    id: item.id!,
    reference: item.reference ?? "",
    title: item.name ?? "",
    summary: item.summary ?? "",
    innovation: item.innovation ?? "",
    isArchived: !!item.is_archived,
    type: item.type,
    eventDate: toDate(item.event_date),
    jurisdiction: item.jurisdiction?.id ? { id: item.jurisdiction.id, title: item.jurisdiction.name ?? "" } : undefined,
    jurisdictionLocation: item.jurisdiction_location,
    caseNumber: item.case_number,
    effectiveDate: toDate(item.effective_date),
    nature: item.nature?.id ? { id: item.nature.id, title: item.nature.name ?? "" } : undefined,
    mail: item.is_archived
      ? undefined
      : {
          recipient: item.recipient_type === "personnel" ? "personnel" : "admin",
          subject: item.mail_object ?? "",
          content: item.mail_content ?? "",
          addresses: toAddresses(item.mail_addresses),
        },
  };
}

export async function getAllJudicialItems() {
  return unwrap(await apiClient.GET("/legal-watches", { params: { query: { type: "legal" } } })).map(mapItem);
}

/** Laws and regulations (the backend groups both under type "mixte"). */
export async function getAllLegislativeItems() {
  return unwrap(await apiClient.GET("/legal-watches", { params: { query: { type: "mixte" } } })).map(mapItem);
}

export async function getOneLegalItem(itemId: string) {
  return mapItem(unwrap(await apiClient.GET("/legal-watches/{itemId}", { params: { path: { itemId } } })));
}

interface MailArgs {
  isArchived: boolean;
  mail?: ItemMail;
}

// Mail fields are only sent for items that go out by mail.
const mailFields = ({ isArchived, mail }: MailArgs) =>
  isArchived || !mail
    ? {}
    : {
        recipient_type: mail.recipient,
        mail_object: mail.subject,
        mail_content: mail.content,
        mail_addresses: mail.addresses,
      };

export interface JudicialArgs extends MailArgs {
  title: string;
  summary: string;
  innovation: string;
  eventDate: string;
  jurisdictionId: string;
  jurisdictionLocation: string;
}

const judicialBody = (args: JudicialArgs) => ({
  name: args.title,
  summary: args.summary,
  innovation: args.innovation,
  event_date: args.eventDate,
  jurisdiction_id: args.jurisdictionId,
  jurisdiction_location: args.jurisdictionLocation,
  is_archived: args.isArchived,
  ...mailFields(args),
});

export async function createJudicialItem(args: JudicialArgs) {
  return mapItem(unwrap(await apiClient.POST("/legal-watches", { body: { ...judicialBody(args), type: "legal" } })));
}

export async function updateJudicialItem(itemId: string, args: JudicialArgs) {
  unwrap(
    await apiClient.PUT("/legal-watches/{itemId}", { params: { path: { itemId } }, body: judicialBody(args) }),
  );
}

export interface LegislativeArgs extends MailArgs {
  title: string;
  caseNumber: string;
  summary: string;
  innovation: string;
  effectiveDate: string;
  natureId: string;
  type: LegislativeType;
}

const legislativeBody = (args: LegislativeArgs) => ({
  name: args.title,
  case_number: args.caseNumber,
  summary: args.summary,
  innovation: args.innovation,
  effective_date: args.effectiveDate,
  nature_id: args.natureId,
  type: args.type,
  is_archived: args.isArchived,
  ...mailFields(args),
});

export async function createLegislativeItem(args: LegislativeArgs) {
  return mapItem(unwrap(await apiClient.POST("/legal-watches", { body: legislativeBody(args) })));
}

export async function updateLegislativeItem(itemId: string, args: LegislativeArgs) {
  unwrap(
    await apiClient.PUT("/legal-watches/{itemId}", { params: { path: { itemId } }, body: legislativeBody(args) }),
  );
}

export async function printLegalItem(itemId: string) {
  const { data, error, response } = await apiClient.GET("/legal-watches/generate-pdf/{itemId}", {
    params: { path: { itemId } },
    parseAs: "arrayBuffer",
  });
  throwIfError(error, "Failed to print the item");
  if (!data) throw new Error("Failed to print the item");
  const filename = response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "legal-watch.pdf";
  return { bytes: Array.from(new Uint8Array(data as ArrayBuffer)), filename };
}
