"use server";

import { apiClient, unwrap } from "@/lib/api/client";
import type { PartyEntityType } from "./constants";

export interface LitigationParty {
  id: string;
  title: string;
  phone?: string;
  email?: string;
  address?: string;
  type: PartyEntityType;
}

type PartyResponse = { id?: string; name?: string; phone?: string; email?: string; address?: string; party_type?: string };

const mapParty = (item: PartyResponse): LitigationParty => ({
  id: item.id!,
  title: item.name ?? "",
  phone: item.phone,
  email: item.email,
  address: item.address,
  type: item.party_type === "legal" ? "legal" : "individual",
});

export async function getAllParties() {
  return unwrap(await apiClient.GET("/litigation/parties")).map(mapParty);
}

export interface CreatePartyArgs {
  title: string;
  phone: string;
  email: string;
  address: string;
  type: PartyEntityType;
}

export async function createParty(args: CreatePartyArgs) {
  const data = unwrap(
    await apiClient.POST("/litigation/parties", {
      body: { name: args.title, phone: args.phone, email: args.email, address: args.address, type: args.type },
    }),
  );
  return mapParty(data);
}
