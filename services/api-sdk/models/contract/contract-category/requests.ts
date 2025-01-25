"use server";
import { ApiError } from "@/services/api-sdk/errors";
import { fetchService } from "@/services/api-sdk/init";
import { log } from "console";
/**
 * Fetches all contract categories from the server.
 * @returns A promise that resolves to an array of contract categories.
 * @throws {ApiError} if the request fails.
 */
export const getAllContractCategories = async () => {
  const response = await fetchService.get(`/contract_categories`);
  console.log(response.data);

  if (response.ok) {
    const data = await response.json();
    return data.data.map(({ id, value }) => ({
      id,
      label: value,
    }));
  }
  throw new ApiError("Failed to fetch all contract categories");
};
/**
 * Fetches all contract category types from the server.
 * @param category - The category of the contract.
 * @returns A promise that resolves to an array of contract category types.
 * @throws {ApiError} if the request fails.
 */
export const getAllContractCategoryTypes = async (category) => {
  const response = await fetchService.get(
    `/contract_type_categories?contract_category_id=${category}`
  );
  if (response.ok) {
    const data = await response.json();
    return data.data.map(({ id, value }) => ({
      id,
      label: value,
    }));
  }
  throw new ApiError("Failed to fetch all contract category types");
};
/**
 * Fetches all contract category subtypes from the server.
 * @param categoryType - The category type of the contract.
 * @returns A promise that resolves to an array of contract category subtypes.
 * @throws {ApiError} if the request fails.
 */
export const getAllContractCategorySubTypes = async (categoryType) => {
  const response = await fetchService.get(
    `/contract_sub_type_categories?contract_type_category_id=${categoryType}`
  );
  if (response.ok) {
    const data = await response.json();
    return data.data.map(({ id, value }) => ({
      id,
      label: value,
    }));
  }
  throw new ApiError("Failed to fetch all contract category subtypes");
};
