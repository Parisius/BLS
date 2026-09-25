"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import type { components } from "@/lib/api/schema";

type BankInfoResponse = components["schemas"]["BankInfo"];

export interface BankInfos {
  name?: string;
  logoUrl?: string;
  headOffice?: string;
  shareholdersCount: number;
  capital?: number;
  nominalValue?: number;
  majorityShareholder?: { name: string; sharePercentage?: number };
}

function mapBankInfos(item: BankInfoResponse | null | undefined): BankInfos {
  return {
    name: item?.denomination,
    logoUrl: item?.logo,
    headOffice: item?.siege_social,
    shareholdersCount: item?.total_shareholders ?? 0,
    capital: item?.capital?.amount,
    nominalValue: item?.capital?.par_value,
    majorityShareholder: item?.majority_shareholder
      ? {
          name: item.majority_shareholder.name ?? "",
          sharePercentage: item.majority_shareholder.percentage != null ? Number(item.majority_shareholder.percentage) : undefined,
        }
      : undefined,
  };
}

export async function getBankInfos() {
  const { data, error } = await apiClient.GET("/bank_infos");
  throwIfError(error, "Failed to fetch the bank infos");
  return mapBankInfos(data?.data);
}

/** Receives the multipart body (denomination, siege_social, optional logo) built by the form. */
export async function updateBankInfos(formData: FormData) {
  const data = unwrap(await apiClient.POST("/bank_infos", { body: formData as never }));
  return mapBankInfos(data);
}

export interface BankCapitalArgs {
  capital: number;
  nominalValue: number;
  date: string;
}

export async function createBankCapital(args: BankCapitalArgs) {
  const { error } = await apiClient.POST("/capitals", {
    body: { amount: args.capital, par_value: args.nominalValue, date: toBackendDate(args.date) },
  });
  throwIfError(error, "Failed to add the capital");
}
