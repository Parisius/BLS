"use server";

import { apiClient, unwrap } from "@/lib/api/client";

export interface IncidentAuthor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export async function getAllIncidentAuthors(): Promise<IncidentAuthor[]> {
  const data = unwrap(await apiClient.GET("/author_incidents"));
  return data.map((item) => ({ id: item.id!, name: item.name ?? "", email: item.email, phone: item.telephone }));
}

export interface IncidentAuthorArgs {
  name: string;
  email: string;
  phone: string;
}

export async function createIncidentAuthor(args: IncidentAuthorArgs): Promise<IncidentAuthor> {
  const item = unwrap(
    await apiClient.POST("/author_incidents", {
      body: { name: args.name, email: args.email, telephone: args.phone },
    }),
  );
  return { id: item.id!, name: item.name ?? "", email: item.email, phone: item.telephone };
}
