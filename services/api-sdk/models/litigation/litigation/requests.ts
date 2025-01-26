"use server";
import { ApiError } from "@/services/api-sdk/errors";
import { fetchService } from "@/services/api-sdk/init";
/**
 * Fetches all litigation from the server.
 * @returns A promise that resolves to an array of litigation.
 * @throws {ApiError} if the request fails.
 */
export const getAllLitigation = async () => {
  const response = await fetchService.get(`/litigation`);
  if (response.ok) {
    const data = await response.json();
    return data.data
      .map((item) => {
        try {
          return {
            id: item.id,
            title: item.name,
            caseNumber: item.case_number,
            reference: item.reference,
            isArchived: item.is_archived,
            jurisdictionLocation: item.jurisdiction_location,
            hasProvisions: item.has_provisions,
            nature: {
              id: item.nature.id,
              title: item.nature.name,
            },
            parties: item.parties.map((party) => ({
              id: party.id,
              name: party.name,
              phone: party.phone,
              email: party.email,
              category: party.category,
              type: party.type,
            })),
            jurisdiction: {
              id: item.jurisdiction.id,
              title: item.jurisdiction.name,
            },
            users:
              item.users?.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
              })) ?? [],
            lawyers:
              item.lawyers?.map((lawyer) => ({
                id: lawyer.id,
                name: lawyer.name,
                phone: lawyer.phone,
                email: lawyer.email,
              })) ?? [],
            estimatedAmount: item.estimated_amount,
            addedAmount: item.added_amount,
            remainingAmount: item.remaining_amount,
          };
        } catch (e) {
          return null;
        }
      })
      .filter((litigation) => litigation !== null);
  }
  throw new ApiError("Failed to fetch all litigation");
};
/**
 * Fetches all unsupplied litigation from the server.
 * @returns A promise that resolves to an array of litigation.
 * @throws {ApiError} if the request fails.
 */
export const getUnSuppliedLitigation = async () => {
  const response = await fetchService.get(`/litigation?type=not_provisioned`);
  if (response.ok) {
    const data = await response.json();
    return data.data
      .map((item) => {
        try {
          return {
            id: item.id,
            title: item.name,
            caseNumber: item.case_number,
            reference: item.reference,
            isArchived: item.is_archived,
            jurisdictionLocation: item.jurisdiction_location,
            hasProvisions: item.has_provisions,
            nature: {
              id: item.nature.id,
              title: item.nature.name,
            },
            parties: item.parties.map((party) => ({
              id: party.id,
              name: party.name,
              phone: party.phone,
              email: party.email,
              category: party.category,
              type: party.type,
            })),
            jurisdiction: {
              id: item.jurisdiction.id,
              title: item.jurisdiction.name,
            },
            users:
              item.users?.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
              })) ?? [],
            lawyers:
              item.lawyers?.map((lawyer) => ({
                id: lawyer.id,
                name: lawyer.name,
                phone: lawyer.phone,
                email: lawyer.email,
              })) ?? [],
            estimatedAmount: item.estimated_amount,
            addedAmount: item.added_amount,
            remainingAmount: item.remaining_amount,
          };
        } catch (e) {
          return null;
        }
      })
      .filter((litigation) => litigation !== null);
  }
  throw new ApiError("Failed to fetch all litigation");
};
/**
 * Fetches one litigation from the server.
 * @param litigationId - The id of the litigation.
 * @returns A promise that resolves to the litigation.
 * @throws {ApiError} if the request fails.
 */
export const getOneLitigation = async (litigationId) => {
  const response = await fetchService.get(`/litigation/${litigationId}`);
  if (response.ok) {
    const { data: item } = await response.json();
    return {
      id: item.id,
      title: item.name,
      caseNumber: item.case_number,
      reference: item.reference,
      isArchived: item.is_archived,
      jurisdictionLocation: item.jurisdiction_location,
      hasProvisions: item.has_provisions,
      currentStep: item.current_step && {
        id: item.current_step.id,
        title: item.current_step.title,
      },
      nextStep: item.next_step && {
        id: item.next_step.id,
        title: item.next_step.title,
      },
      nature: {
        id: item.nature.id,
        title: item.nature.name,
      },
      parties: item.parties.map((party) => ({
        id: party.id,
        name: party.name,
        phone: party.phone,
        email: party.email,
        category: party.category,
        type: party.type,
      })),
      jurisdiction: {
        id: item.jurisdiction.id,
        title: item.jurisdiction.name,
      },
      files:
        item.documents?.map((doc) => ({
          fileUrl: doc.file_url,
          filename: doc.filename,
        })) || [],
      users:
        item.users?.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        })) ?? [],
      lawyers:
        item.lawyers?.map((lawyer) => ({
          id: lawyer.id,
          name: lawyer.name,
          phone: lawyer.phone,
          email: lawyer.email,
        })) ?? [],
      estimatedAmount: item.estimated_amount,
      addedAmount: item.added_amount,
      remainingAmount: item.remaining_amount,
    };
  }
  throw new ApiError("Failed to fetch this litigation");
};
/**
 * Fetches the litigation provisions summary from the server.
 * @returns A promise that resolves to the litigation provisions summary.
 * @throws {ApiError} if the request fails.
 */
export const getLitigationProvisionsSummary = async () => {
  const response = await fetchService.get("/litigation/provisions/stats");
  if (response.ok) {
    const { data: item } = await response.json();
    return {
      totalAddedAmount: item.sum_added_amount,
      totalEstimatedAmount: item.sum_estimated_amount,
      totalRemainingAmount: item.sum_remaining_amount,
    };
  }
  throw new ApiError("Failed to fetch the litigation provisions summary");
};
/**
 * Creates a litigation.
 * @param args - The form data to create the litigation.
 * @returns The created litigation.
 * @throws {ApiError} if the request fails.
 */
export const createLitigation = async (args) => {
  args.filesData.append("name", args.title);
  args.filesData.append("case_number", args.caseNumber);
  args.filesData.append("nature_id", args.natureId);
  args.filesData.append("jurisdiction_id", args.jurisdictionId);
  args.filesData.append("jurisdiction_location", args.jurisdictionLocation);
  args.filesData.append("has_provisions", args.hasProvisions ? "1" : "0");
  args.parties.forEach((party, index) => {
    args.filesData.append(`parties[${index}][party_id]`, party.partyId);
    args.filesData.append(`parties[${index}][category]`, party.category);
    args.filesData.append(`parties[${index}][type]`, party.type);
  });
  console.log(args);

  const response = await fetchService.post("/litigation", args.filesData);
  console.log(response);

  if (!response.ok) {
    throw new ApiError("Failed to create the litigation");
  }
  const { data: item } = await response.json();
  return {
    id: item.id,
    title: item.name,
    caseNumber: item.case_number,
    reference: item.reference,
    isArchived: item.is_archived,
    jurisdictionLocation: item.jurisdiction_location,
    hasProvisions: item.has_provisions,
    nature: {
      id: item.nature.id,
      title: item.nature.name,
    },
    parties: item.parties.map((party) => ({
      id: party.id,
      name: party.name,
      phone: party.phone,
      email: party.email,
      category: party.category,
      type: party.type,
    })),
    jurisdiction: {
      id: item.jurisdiction.id,
      title: item.jurisdiction.name,
    },
    users:
      item.users?.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })) ?? [],
    lawyers:
      item.lawyers?.map((lawyer) => ({
        id: lawyer.id,
        name: lawyer.name,
        phone: lawyer.phone,
        email: lawyer.email,
      })) ?? [],
    estimatedAmount: item.estimated_amount,
    addedAmount: item.added_amount,
    remainingAmount: item.remaining_amount,
  };
};
/**
 * Updates a litigation.
 * @param litigationId - The id of the litigation.
 * @param args - The form data to update the litigation.
 * @returns The updated litigation.
 * @throws {ApiError} if the request fails.
 */
export const updateLitigation = async (litigationId, args) => {
  const formData = args.filesData ?? new FormData();
  if (args.title) formData.append("name", args.title);
  if (args.caseNumber) formData.append("case_number", args.caseNumber);
  if (args.natureId) formData.append("nature_id", args.natureId);
  if (args.jurisdictionLocation)
    formData.append("jurisdiction_location", args.jurisdictionLocation);
  if (args.jurisdictionId)
    formData.append("jurisdiction_id", args.jurisdictionId);
  if (typeof args.hasProvisions === "boolean")
    formData.append("has_provisions", args.hasProvisions ? "1" : "0");
  args.parties?.forEach((party, index) => {
    formData.append(`parties[${index}][party_id]`, party.partyId);
    formData.append(`parties[${index}][category]`, party.category);
    formData.append(`parties[${index}][type]`, party.type);
  });
  const response = await fetchService.post(
    `/litigation/modify/${litigationId}`,
    formData
  );
  if (!response.ok) {
    throw new ApiError("Failed to update the litigation");
  }
  const { data: item } = await response.json();
  return {
    id: item.id,
    title: item.name,
    caseNumber: item.case_number,
    reference: item.reference,
    isArchived: item.is_archived,
    jurisdictionLocation: item.jurisdiction_location,
    hasProvisions: item.has_provisions,
    nature: {
      id: item.nature.id,
      title: item.nature.name,
    },
    parties: item.parties.map((party) => ({
      id: party.id,
      name: party.name,
      phone: party.phone,
      email: party.email,
      category: party.category,
      type: party.type,
    })),
    jurisdiction: {
      id: item.jurisdiction.id,
      title: item.jurisdiction.name,
    },
    users:
      item.users?.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })) ?? [],
    lawyers:
      item.lawyers?.map((lawyer) => ({
        id: lawyer.id,
        name: lawyer.name,
        phone: lawyer.phone,
        email: lawyer.email,
      })) ?? [],
    estimatedAmount: item.estimated_amount,
    addedAmount: item.added_amount,
    remainingAmount: item.remaining_amount,
  };
};
/**
 * Adds litigation provisions.
 * @param litigationId - The id of the litigation.
 * @param args - The form data to add the litigation provisions.
 * @returns The updated litigation.
 * @throws {ApiError} if the request fails.
 */
export const addLitigationProvisions = async (litigationId, args) => {
  const response = await fetchService.put(
    `/litigation/update-amount/${litigationId}`,
    JSON.stringify({
      estimated_amount: args.estimatedAmount,
      added_amount: args.addedAmount,
      remaining_amount: args.remainingAmount,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) {
    throw new ApiError("Failed to add the litigation provisions");
  }
  const { data: item } = await response.json();
  return {
    id: item.id,
    title: item.name,
    caseNumber: item.case_number,
    reference: item.reference,
    isArchived: item.is_archived,
    jurisdictionLocation: item.jurisdiction_location,
    hasProvisions: item.has_provisions,
    nature: {
      id: item.nature.id,
      title: item.nature.name,
    },
    parties: item.parties.map((party) => ({
      id: party.id,
      name: party.name,
      phone: party.phone,
      email: party.email,
      category: party.category,
      type: party.type,
    })),
    jurisdiction: {
      id: item.jurisdiction.id,
      title: item.jurisdiction.name,
    },
    users:
      item.users?.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })) ?? [],
    lawyers:
      item.lawyers?.map((lawyer) => ({
        id: lawyer.id,
        name: lawyer.name,
        phone: lawyer.phone,
        email: lawyer.email,
      })) ?? [],
    estimatedAmount: item.estimated_amount,
    addedAmount: item.added_amount,
    remainingAmount: item.remaining_amount,
  };
};
/**
 * Archives a litigation.
 * @param litigationId - The id of the litigation.
 * @throws {ApiError} if the request fails.
 */
export const archiveLitigation = async (litigationId) => {
  const response = await fetchService.put(
    `/litigation/archive/${litigationId}`
  );
  if (!response.ok) {
    throw new ApiError("Failed to archive the litigation");
  }
};
/**
 * Assigns collaborators to a litigation.
 * @param litigationId - The id of the litigation.
 * @param args - The form data to assign the collaborators.
 * @throws {ApiError} if the request fails.
 */
export const assignCollaborators = async (litigationId, args) => {
  const response = await fetchService.put(
    `/litigation/assign-user/${litigationId}`,
    JSON.stringify({
      users: args.users,
      lawyers: args.lawyers,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) {
    throw new ApiError("Failed to assign collaborators to the litigation");
  }
};
/**
 * Prints a litigation.
 * @param litigationId - The id of the litigation.
 * @throws {ApiError} if the request fails.
 */
export const printLitigation = async (litigationId) => {
  const response = await fetchService.get(
    `/litigation/generate-pdf/${litigationId}`
  );
  if (!response.ok) {
    throw new ApiError("Failed to print the litigation");
  }
  const buffer = Array.from(new Uint8Array(await response.arrayBuffer()));
  const filename =
    response.headers
      .get("Content-Disposition")
      ?.match(/filename="(.+)"/)?.[1] ?? "litigation.pdf";
  return {
    buffer,
    filename,
  };
};
