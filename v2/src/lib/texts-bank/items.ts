"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import { KIND_TYPE, type BankKind } from "./kinds";

type BankResponse = components["schemas"]["BankItem"];

export interface BankItem {
  id: string;
  title: string;
  /** Texts and other documents. */
  fileUrl?: string;
  /** Links. */
  link?: string;
}

const mapItem = (item: BankResponse): BankItem => ({
  id: item.id!,
  title: item.title ?? "",
  fileUrl: item.file_url,
  link: item.link,
});

export async function getAllBankItems(kind: BankKind) {
  return unwrap(await apiClient.GET("/banks", { params: { query: { type: KIND_TYPE[kind] } } })).map(mapItem);
}

export async function getOneBankItem(itemId: string) {
  return mapItem(unwrap(await apiClient.GET("/banks/{documentId}", { params: { path: { documentId: itemId } } })));
}

/** Links go as JSON (title + address); file kinds as multipart (title + file), as the original app did. */
const isLinkForm = (formData: FormData) => formData.has("link");

export async function createBankItem(kind: BankKind, formData: FormData) {
  formData.set("type", KIND_TYPE[kind]);
  // The typed body models neither shape; a real FormData is sent as multipart, a plain object as JSON.
  const body = isLinkForm(formData)
    ? { title: String(formData.get("title")), link: String(formData.get("link")), type: KIND_TYPE[kind] }
    : formData;
  return mapItem(unwrap(await apiClient.POST("/banks", { body: body as never })));
}

export async function updateBankItem(itemId: string, formData: FormData) {
  const params = { path: { documentId: itemId } };

  if (isLinkForm(formData)) {
    const body = { title: String(formData.get("title")), link: String(formData.get("link")) };
    return mapItem(unwrap(await apiClient.PUT("/banks/{documentId}", { params, body: body as never })));
  }

  // Bug fix vs. the original app: it sent this as a multipart PUT, which PHP/Laravel does not parse, so the request
  // "succeeded" with an empty body and nothing was ever saved. Multipart updates go as a POST with `_method=PUT`.
  formData.set("_method", "PUT");
  return mapItem(unwrap(await apiClient.POST("/banks/{documentId}", { params, body: formData as never })));
}

export async function deleteBankItem(itemId: string) {
  const { error } = await apiClient.DELETE("/banks/{documentId}", { params: { path: { documentId: itemId } } });
  throwIfError(error, "Failed to delete the item");
}
