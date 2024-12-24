"use server";
import { ApiError } from "@/services/api-sdk/errors";
import { fetchService } from "@/services/api-sdk/init";
/**
 * Fetches all shareholders from the server.
 * @returns A promise that resolves to an array of shareholders.
 * @throws {ApiError} if the request fails.
 */
export const getAllShareholders = async () => {
  const response = await fetchService.get("/shareholders");
  if (response.ok) {
    const data = await response.json();
    return data.data
      .map((item) => {
        try {
          return {
            id: item.id,
            name: item.name,
            nationality: item.nationality,
            address: item.address,
            type: item.type,
            corporateType: item.corporate_type,
            encumberedShares: item.actions_encumbered,
            unencumberedShares: item.actions_no_encumbered,
            sharePercentage: item.percentage,
          };
        } catch (e) {
          return null;
        }
      })
      .filter((shareholder) => shareholder !== null);
  }
  throw new ApiError("Failed to fetch all shareholders");
};
/**
 * Fetches one shareholder from the server.
 * @param shareholderId - The id of the shareholder.
 * @returns A promise that resolves to the shareholder.
 * @throws {ApiError} if the request fails.
 */
export const getOneShareholder = async (shareholderId) => {
  const response = await fetchService.get(`/shareholders/${shareholderId}`);
  if (response.ok) {
    const { data: item } = await response.json();
    return {
      id: item.id,
      name: item.name,
      nationality: item.nationality,
      address: item.address,
      type: item.type,
      corporateType: item.corporate_type,
      encumberedShares: item.actions_encumbered,
      unencumberedShares: item.actions_no_encumbered,
      sharePercentage: item.percentage,
    };
  }
  throw new ApiError("Failed to fetch this shareholder");
};
/**
 * Creates a shareholder.
 * @param args - The form data to create the shareholder.
 * @returns The created shareholder.
 * @throws {ApiError} if the request fails.
 */
export const createShareholder = async (args) => {
  const response = await fetchService.post(
    "/shareholders",
    JSON.stringify({
      name: args.name,
      nationality: args.nationality,
      address: args.address,
      type: args.type,
      corporate_type: args.corporateType,
      actions_encumbered: args.encumberedShares,
      actions_no_encumbered: args.unencumberedShares,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) {
    throw new ApiError("Failed to create the shareholder");
  }
  const { data: item } = await response.json();
  return {
    id: item.id,
    name: item.name,
    nationality: item.nationality,
    address: item.address,
    type: item.type,
    corporateType: item.corporate_type,
    encumberedShares: item.actions_encumbered,
    unencumberedShares: item.actions_no_encumbered,
    sharePercentage: item.percentage,
  };
};
/**
 * Updates a shareholder.
 * @param shareholderId - The id of the shareholder.
 * @param args - The form data to update the shareholder.
 * @returns The updated shareholder.
 * @throws {ApiError} if the request fails.
 */
export const updateShareholder = async (shareholderId, args) => {
  const response = await fetchService.put(
    `/shareholders/${shareholderId}`,
    JSON.stringify({
      name: args.name,
      nationality: args.nationality,
      address: args.address,
      type: args.type,
      corporate_type: args.corporateType,
      actions_encumbered: args.encumberedShares,
      actions_no_encumbered: args.unencumberedShares,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) {
    throw new ApiError("Failed to update the shareholder");
  }
  const { data: item } = await response.json();
  return {
    id: item.id,
    name: item.name,
    nationality: item.nationality,
    address: item.address,
    type: item.type,
    corporateType: item.corporate_type,
    encumberedShares: item.actions_encumbered,
    unencumberedShares: item.actions_no_encumbered,
    sharePercentage: item.percentage,
  };
};
/**
 * Prints the shares certificate of a shareholder.
 * @param shareholderId - The id of the shareholder.
 * @throws {ApiError} if the request fails.
 */
export const printSharesCertificate = async (shareholderId) => {
  const response = await fetchService.get(
    `/generate_pdf_certificat_shareholder?shareholder_id=${shareholderId}`
  );
  if (!response.ok) {
    throw new ApiError("Failed to print the shares certificate");
  }
  const buffer = Array.from(new Uint8Array(await response.arrayBuffer()));
  const filename =
    response.headers
      .get("Content-Disposition")
      ?.match(/filename="(.+)"/)?.[1] ?? "list.pdf";
  return {
    buffer,
    filename,
  };
};
/**
 * Deletes a shareholder.
 * @param shareholderId - The id of the shareholder.
 * @throws {ApiError} if the request fails.
 */
export const deleteShareholder = async (shareholderId) => {
  const response = await fetchService.delete(`/shareholders/${shareholderId}`);
  if (!response.ok) {
    throw new ApiError("Failed to delete the shareholder");
  }
};
