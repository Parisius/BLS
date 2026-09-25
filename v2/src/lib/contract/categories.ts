"use server";

import { apiClient, unwrap } from "@/lib/api/client";

export interface ContractCategoryOption {
  id: string;
  label: string;
}

function mapCategory(item: { id?: string; value?: string }): ContractCategoryOption {
  return { id: item.id!, label: item.value ?? "" };
}

export async function getAllContractCategories() {
  const data = unwrap(await apiClient.GET("/contract_categories"));
  return data.map(mapCategory);
}

export async function getAllContractCategoryTypes(categoryId: string) {
  const data = unwrap(
    await apiClient.GET("/contract_type_categories", {
      params: { query: { contract_category_id: categoryId } },
    }),
  );
  return data.map(mapCategory);
}

export async function getAllContractCategorySubTypes(categoryTypeId: string) {
  const data = unwrap(
    await apiClient.GET("/contract_sub_type_categories", {
      params: { query: { contract_type_category_id: categoryTypeId } },
    }),
  );
  return data.map(mapCategory);
}
