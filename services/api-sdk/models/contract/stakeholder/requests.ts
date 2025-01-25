"use server";
import { ApiError } from "@/services/api-sdk/errors";
import { fetchService } from "@/services/api-sdk/init";
/**
 * Fetches all stakeholders from the server.
 * @returns A promise that resolves to an array of stakeholders.
 * @throws {ApiError} if the request fails.
 */
export const getAllStakeholders = async () => {
  const response = await fetchService.get("/parts");
  if (response.ok) {
    const { data: items } = await response.json();
    return items
      .map((item) => {
        try {
          return {
            id: item.id,
            name: item.denomination ?? item.name,
            email: item.email,
            type: item.type,
          };
        } catch (error) {
          return null;
        }
      })
      .filter((item) => item !== null);
  }
  throw new ApiError("Failed to fetch link items");
};
/**
 * Fetches a single stakeholder from the server.
 * @param {string} stakeholderId - The ID of the stakeholder to fetch.
 * @returns A promise that resolves to the stakeholder.
 * @throws {ApiError} if the request fails.
 */
export const getOneStakeholder = async (stakeholderId) => {
  const response = await fetchService.get(`/parts/${stakeholderId}`);
  if (response.ok) {
    const { data: item } = await response.json();
    try {
      return {
        id: item.id,
        name: item.denomination ?? item.name,
        email: item.email,
        type: item.type,
      };
    } catch (error) {
      throw new ApiError("Failed to parse stakeholder");
    }
  }
  throw new ApiError("Failed to fetch stakeholder");
};
/**
 * Creates a stakeholder.
 * @param args - The form data to create the stakeholder.
 * @returns The created stakeholder.
 * @throws {ApiError} if the request fails.
 */
export const createStakeholder = async (args) => {
  const response = await fetchService.post(
    "/parts",
    JSON.stringify({
      name: args.name,
      denomination: args.denomination,
      type: args.type,
      email: args.email,
      telephone: args.phone,
      residence: args.residence,
      zip_code: args.zipCode,
      number_rccm: args.numberRCCM,
      number_ifu: args.numberIFU,
      id_card: args.cardId,
      capital: args.capital,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) {
    throw new ApiError("Failed to create the corporate item");
  }
  const { data: item } = await response.json();
  return {
    id: item.id,
    name: item.denomination ?? item.name,
    email: item.email,
    type: item.type,
  };
};
