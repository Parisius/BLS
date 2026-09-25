"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import type { components } from "@/lib/api/schema";

type ContractResponse = components["schemas"]["Contract"];

export interface StakeholderGroupItem {
  stakeholderId: string;
  description: string;
}

export interface Contract {
  id: string;
  title: string;
  category: { id: string; label: string };
  categoryType?: { id: string; label: string };
  categorySubType?: { id: string; label: string };
  createdBy?: string;
  signatureDate?: string;
  effectiveDate?: string;
  expirationDate?: string;
  renewalDate?: string;
  firstStakeholdersGroup: StakeholderGroupItem[];
  secondStakeholdersGroup: StakeholderGroupItem[];
  filesGroups: { stepName: string; files: { filename: string; fileUrl: string }[] }[];
  forwards: {
    id: string;
    title: string;
    dueDate: string;
    description: string;
    completed: boolean;
    sender: { id: string; firstname: string; lastname: string; email: string };
    receiver: { id: string; firstname: string; lastname: string; email: string };
  }[];
}

// All ids in this backend are UUID strings, not numbers — never `Number(...)` them.
function mapCategoryRef(ref?: { id?: string; value?: string }) {
  return ref?.id != null ? { id: ref.id, label: ref.value ?? "" } : undefined;
}

function mapContract(item: ContractResponse): Contract {
  return {
    id: item.id!,
    title: item.title ?? "",
    category: mapCategoryRef(item.category as never)!,
    categoryType: mapCategoryRef(item.type_category as never),
    categorySubType: mapCategoryRef(item.sub_type_category as never),
    createdBy: item.created_by,
    signatureDate: item.date_signature,
    effectiveDate: item.date_effective,
    expirationDate: item.date_expiration,
    renewalDate: item.date_renewal,
    firstStakeholdersGroup: (item.first_part as { part_id?: string; description?: string }[] ?? []).map(
      (part) => ({ stakeholderId: String(part.part_id), description: part.description ?? "" }),
    ),
    secondStakeholdersGroup: (item.second_part as { part_id?: string; description?: string }[] ?? []).map(
      (part) => ({ stakeholderId: String(part.part_id), description: part.description ?? "" }),
    ),
    filesGroups: (item.documents as {
      step_name?: string;
      files?: { filename?: string; file_url?: string }[];
    }[] ?? []).map((group) => ({
      stepName: group.step_name ?? "",
      files: (group.files ?? []).map((file) => ({
        filename: file.filename ?? "",
        fileUrl: file.file_url ?? "",
      })),
    })),
    forwards: (item.transfers as {
      id?: string;
      title?: string;
      deadline?: string;
      description?: string;
      status?: boolean;
      sender?: { id?: string; firstname?: string; lastname?: string; email?: string };
      collaborators?: { id?: string; firstname?: string; lastname?: string; email?: string }[];
    }[] ?? []).map((transfer) => ({
      id: transfer.id!,
      title: transfer.title ?? "",
      dueDate: transfer.deadline ?? "",
      description: transfer.description ?? "",
      completed: !!transfer.status,
      sender: {
        id: transfer.sender?.id ?? "",
        firstname: transfer.sender?.firstname ?? "",
        lastname: transfer.sender?.lastname ?? "",
        email: transfer.sender?.email ?? "",
      },
      receiver: {
        id: transfer.collaborators?.[0]?.id ?? "",
        firstname: transfer.collaborators?.[0]?.firstname ?? "",
        lastname: transfer.collaborators?.[0]?.lastname ?? "",
        email: transfer.collaborators?.[0]?.email ?? "",
      },
    })),
  };
}

export async function getAllContracts() {
  const data = unwrap(await apiClient.GET("/contracts"));
  return data.map(mapContract);
}

export async function getOneContract(contractId: string) {
  const data = unwrap(
    await apiClient.GET("/contracts/{contractId}", { params: { path: { contractId } } }),
  );
  return mapContract(data);
}

export interface DocumentInput {
  file: File;
  filename: string;
}

export interface CreateContractArgs {
  title: string;
  category: string;
  categoryType?: string;
  categorySubType?: string;
  firstStakeholdersGroup: StakeholderGroupItem[];
  secondStakeholdersGroup: StakeholderGroupItem[];
  files: DocumentInput[];
}

function appendStakeholderGroup(formData: FormData, fieldName: string, group: StakeholderGroupItem[]) {
  group.forEach((part, index) => {
    formData.append(`${fieldName}[${index}][part_id]`, part.stakeholderId);
    formData.append(`${fieldName}[${index}][description]`, part.description);
  });
}

function appendDocuments(formData: FormData, files: DocumentInput[]) {
  files.forEach((doc, index) => {
    formData.append(`contract_documents[${index}][file]`, doc.file);
    formData.append(`contract_documents[${index}][name]`, doc.filename);
  });
}

export async function createContract(args: CreateContractArgs) {
  const formData = new FormData();
  formData.append("title", args.title);
  formData.append("contract_category_id", args.category);
  if (args.categoryType) formData.append("contract_type_category_id", args.categoryType);
  if (args.categorySubType) formData.append("contract_sub_type_category_id", args.categorySubType);
  appendStakeholderGroup(formData, "first_part", args.firstStakeholdersGroup);
  appendStakeholderGroup(formData, "second_part", args.secondStakeholdersGroup);
  appendDocuments(formData, args.files);

  // openapi-fetch's typed `body` doesn't model bracket-indexed multipart
  // fields (first_part[0][part_id], etc.) — passing a real FormData instance
  // is the documented escape hatch; it's detected at runtime and sent as-is.
  const data = unwrap(await apiClient.POST("/contracts", { body: formData as never }));
  return mapContract(data);
}

export interface UpdateContractArgs {
  title: string;
  category: string;
  categoryType?: string;
  categorySubType?: string;
  firstStakeholdersGroup: StakeholderGroupItem[];
  secondStakeholdersGroup: StakeholderGroupItem[];
}

export async function updateContract(contractId: string, args: UpdateContractArgs) {
  const data = unwrap(
    await apiClient.PUT("/contracts/{contractId}", {
      params: { path: { contractId } },
      body: {
        title: args.title,
        contract_category_id: args.category,
        contract_type_category_id: args.categoryType,
        contract_sub_type_category_id: args.categorySubType,
        first_part: args.firstStakeholdersGroup.map((part) => ({
          part_id: part.stakeholderId,
          description: part.description,
        })),
        second_part: args.secondStakeholdersGroup.map((part) => ({
          part_id: part.stakeholderId,
          description: part.description,
        })),
      },
    }),
  );
  return mapContract(data);
}

export interface ForwardContractArgs {
  title: string;
  dueDate: string;
  receiverId: string;
  description: string;
}

export async function forwardContract(contractId: string, args: ForwardContractArgs) {
  const { error } = await apiClient.PUT("/contracts/{contractId}", {
    params: { path: { contractId } },
    body: {
      forward_title: args.title,
      deadline_transfer: toBackendDate(args.dueDate),
      description: args.description,
      collaborators: [args.receiverId],
    },
  });
  throwIfError(error, "Failed to forward the contract");
}

export interface PlanContractDatesArgs {
  signatureDate?: string;
  effectiveDate?: string;
  expirationDate?: string;
  renewalDate?: string;
}

export async function planContractDates(contractId: string, args: PlanContractDatesArgs) {
  const { error } = await apiClient.PUT("/contracts/{contractId}", {
    params: { path: { contractId } },
    body: {
      date_signature: args.signatureDate ? toBackendDate(args.signatureDate) : undefined,
      date_effective: args.effectiveDate ? toBackendDate(args.effectiveDate) : undefined,
      date_expiration: args.expirationDate ? toBackendDate(args.expirationDate) : undefined,
      date_renewal: args.renewalDate ? toBackendDate(args.renewalDate) : undefined,
    },
  });
  throwIfError(error, "Failed to plan the contract dates");
}

export async function completeContract(
  contractId: string,
  args: { transferId: string; files: DocumentInput[] },
) {
  const formData = new FormData();
  formData.append("type", "contract");
  formData.append("transfer_id", String(args.transferId));
  appendDocuments(formData, args.files);

  const { error } = await apiClient.POST("/complete_transfers", { body: formData as never });
  throwIfError(error, "Failed to complete the contract");
}

export async function deleteContract(contractId: string) {
  const { error } = await apiClient.DELETE("/contracts/{contractId}", {
    params: { path: { contractId } },
  });
  throwIfError(error, "Failed to delete the contract");
}

export async function printContract(contractId: string) {
  const { data, error, response } = await apiClient.GET("/generate_pdf_fiche_suivi_contract", {
    params: { query: { contract_id: String(contractId) } },
    parseAs: "arrayBuffer",
  });
  throwIfError(error, "Failed to print the contract");
  if (!data) throw new Error("Failed to print the contract");
  const filename =
    response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "contract.pdf";
  return { bytes: Array.from(new Uint8Array(data as ArrayBuffer)), filename };
}
