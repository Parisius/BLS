"use server";

import { apiClient, unwrap } from "@/lib/api/client";

export interface Stakeholder {
  id: string;
  name: string;
  email?: string;
  type: "individual" | "corporate";
}

function mapStakeholder(item: {
  id?: string;
  name?: string;
  denomination?: string;
  email?: string;
  type?: string;
}): Stakeholder {
  return {
    id: item.id!,
    name: item.denomination ?? item.name ?? "",
    email: item.email,
    type: item.type === "corporate" ? "corporate" : "individual",
  };
}

export async function getAllStakeholders() {
  const data = unwrap(await apiClient.GET("/parts"));
  return data.map(mapStakeholder);
}

export interface CreateStakeholderArgs {
  type: "individual" | "corporate";
  name: string;
  email: string;
  phone: string;
  residence: string;
  zipCode: string;
  cardId?: string;
  denomination?: string;
  numberRCCM?: string;
  numberIFU?: string;
  capital?: number;
}

export async function createStakeholder(args: CreateStakeholderArgs) {
  const data = unwrap(
    await apiClient.POST("/parts", {
      body: {
        type: args.type,
        name: args.name,
        denomination: args.denomination,
        email: args.email,
        telephone: args.phone,
        residence: args.residence,
        zip_code: args.zipCode,
        number_rccm: args.numberRCCM,
        number_ifu: args.numberIFU,
        id_card: args.cardId,
        capital: args.capital != null ? String(args.capital) : undefined,
      },
    }),
  );
  return mapStakeholder(data);
}
