"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

type ShareholderResponse = components["schemas"]["Shareholder"];

export type ShareholderType = "individual" | "corporate";
export type CorporateType = "company" | "institution";

export interface Shareholder {
  id: string;
  name: string;
  nationality: string;
  address: string;
  type: ShareholderType;
  corporateType?: CorporateType;
  encumberedShares: number;
  unencumberedShares: number;
  sharePercentage: number;
}

function mapShareholder(item: ShareholderResponse): Shareholder {
  return {
    id: item.id!,
    name: item.name ?? "",
    nationality: item.nationality ?? "",
    address: item.address ?? "",
    type: item.type === "corporate" ? "corporate" : "individual",
    corporateType: item.corporate_type === "company" || item.corporate_type === "institution" ? item.corporate_type : undefined,
    encumberedShares: Number(item.actions_encumbered ?? 0),
    unencumberedShares: Number(item.actions_no_encumbered ?? 0),
    sharePercentage: Number(item.percentage ?? 0),
  };
}

export async function getAllShareholders() {
  const data = unwrap(await apiClient.GET("/shareholders"));
  return data.map(mapShareholder);
}

export interface ShareholderFormArgs {
  name: string;
  nationality: string;
  address: string;
  type: ShareholderType;
  corporateType?: CorporateType;
  encumberedShares: number;
  unencumberedShares: number;
}

function toBody(args: ShareholderFormArgs) {
  return {
    name: args.name,
    nationality: args.nationality,
    address: args.address,
    type: args.type,
    corporate_type: args.type === "corporate" ? args.corporateType : undefined,
    actions_encumbered: args.encumberedShares,
    actions_no_encumbered: args.unencumberedShares,
  };
}

export async function createShareholder(args: ShareholderFormArgs) {
  return mapShareholder(unwrap(await apiClient.POST("/shareholders", { body: toBody(args) })));
}

export async function updateShareholder(shareholderId: string, args: ShareholderFormArgs) {
  return mapShareholder(
    unwrap(
      await apiClient.PUT("/shareholders/{shareholderId}", {
        params: { path: { shareholderId } },
        body: toBody(args),
      }),
    ),
  );
}

export async function deleteShareholder(shareholderId: string) {
  const { error } = await apiClient.DELETE("/shareholders/{shareholderId}", {
    params: { path: { shareholderId } },
  });
  throwIfError(error, "Failed to delete the shareholder");
}

export async function printSharesCertificate(shareholderId: string) {
  const { data, error, response } = await apiClient.GET("/generate_pdf_certificat_shareholder", {
    params: { query: { shareholder_id: shareholderId } },
    parseAs: "arrayBuffer",
  });
  throwIfError(error, "Failed to print the shares certificate");
  if (!data) throw new Error("Failed to print the shares certificate");
  const filename =
    response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "certificate.pdf";
  return { bytes: Array.from(new Uint8Array(data as ArrayBuffer)), filename };
}
