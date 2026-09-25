"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";

export interface ContractModelItem {
  id: string;
  parentId?: string;
  type: "folder" | "file" | string;
  name: string;
  fileUrl?: string;
}

export interface ContractModelFolder {
  id?: string;
  name?: string;
  children: ContractModelItem[];
}

function mapModelItem(item: {
  id?: string;
  parent_id?: string;
  type?: string;
  name?: string;
  file_path?: string;
}): ContractModelItem {
  return {
    id: item.id!,
    parentId: item.parent_id,
    type: item.type ?? "file",
    name: item.name ?? "",
    fileUrl: item.file_path,
  };
}

export async function getAllContractModels(parentId?: string): Promise<ContractModelFolder> {
  const data = unwrap(
    await apiClient.GET("/contract_models", {
      params: { query: { parent_id: parentId } },
    }),
  );
  return {
    id: data.parent?.id,
    name: data.parent?.name,
    children: (data.children ?? []).map(mapModelItem),
  };
}

export interface CreateContractModelArgs {
  parentId?: string;
  name: string;
  type: "folder" | "file";
  file?: File;
}

export async function createContractModel(args: CreateContractModelArgs) {
  const formData = new FormData();
  if (args.file) formData.append("file", args.file);
  if (args.parentId) formData.append("parent_id", args.parentId);
  formData.append("name", args.name);
  formData.append("type", args.type);

  const data = unwrap(await apiClient.POST("/contract_models", { body: formData as never }));
  return mapModelItem(data);
}

export async function deleteContractModel(modelId: string) {
  const { error } = await apiClient.DELETE("/contract_models/{modelId}", {
    params: { path: { modelId } },
  });
  throwIfError(error, "Failed to delete the contract model");
}
