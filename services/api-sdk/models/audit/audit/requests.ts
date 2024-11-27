"use server";
import { ApiError } from "@/services/api-sdk/errors";
import { fetchService } from "@/services/api-sdk/init";
import { formatDate } from "@/services/api-sdk/lib/utils";
/**
 * Fetches all audit for a user profile from the server.
 * @returns A promise that resolves to the audit.
 * @throws {ApiError} if the request fails.
 */
export const getAllAudits = async () => {
  const response = await fetchService.get("/audit_notations");
  if (response.ok) {
    const data = await response.json();
    return data.data
      .map((item) => {
        try {
          return {
            id: item.id,
            reference: item.audit_reference,
            title: item.title,
            module: item.module,
            moduleId: item.module_id,
            originalGlobalScore: item.original_note,
            originalStatus: item.original_status,
            currentGlobalScore: item.last_note,
            currentStatus: item.last_status,
            createdBy: item.creator,
            originalScores: item.original_indicators.map((score) => ({
              score: score.note,
              criteria: {
                id: score.audit_performance_indicator.id,
                title: score.audit_performance_indicator.title,
                type: score.audit_performance_indicator.type,
                maxScore: score.audit_performance_indicator.note,
              },
            })),
            currentScores: item.last_indicators.map((score) => ({
              score: score.note,
              criteria: {
                id: score.audit_performance_indicator.id,
                title: score.audit_performance_indicator.title,
                type: score.audit_performance_indicator.type,
                maxScore: score.audit_performance_indicator.note,
              },
            })),
          };
        } catch (e) {
          return null;
        }
      })
      .filter((audit) => audit !== null);
  }
  throw new ApiError("Failed to fetch the audit");
};
/**
 * Fetches a single audit from the server.
 * @param auditId - The id of the audit.
 * @returns A promise that resolves to the audit.
 * @throws {ApiError} if the request fails.
 */
export const getOneAudit = async (auditId) => {
  const response = await fetchService.get(`/audit_notations/${auditId}`);
  if (response.ok) {
    const { data: item } = await response.json();
    return {
      id: item.id,
      reference: item.audit_reference,
      title: item.title,
      module: item.module,
      moduleId: item.module_id,
      originalGlobalScore: item.original_note,
      originalStatus: item.original_status,
      currentGlobalScore: item.last_note,
      currentStatus: item.last_status,
      createdBy: item.creator,
      originalScores: item.original_indicators.map((score) => ({
        score: score.note,
        criteria: {
          id: score.audit_performance_indicator.id,
          title: score.audit_performance_indicator.title,
          type: score.audit_performance_indicator.type,
          maxScore: score.audit_performance_indicator.note,
        },
      })),
      currentScores: item.last_indicators.map((score) => ({
        score: score.note,
        criteria: {
          id: score.audit_performance_indicator.id,
          title: score.audit_performance_indicator.title,
          type: score.audit_performance_indicator.type,
          maxScore: score.audit_performance_indicator.note,
        },
      })),
      forwards: item.transfers?.map((transfer) => ({
        id: transfer.id,
        title: transfer.title,
        dueDate: new Date(transfer.deadline),
        description: transfer.description,
        completed: transfer.status,
        globalScore: transfer.notation.note,
        scores: transfer.notation.indicators.map((score) => ({
          score: score.note,
          criteria: {
            id: score.audit_performance_indicator.id,
            title: score.audit_performance_indicator.title,
            type: score.audit_performance_indicator.type,
            maxScore: score.audit_performance_indicator.note,
          },
        })),
        sender: {
          id: transfer.sender.id,
          firstname: transfer.sender.firstname,
          lastname: transfer.sender.lastname,
          email: transfer.sender.email,
        },
        receiver: {
          id: transfer.collaborators[0].id,
          firstname: transfer.collaborators[0].firstname,
          lastname: transfer.collaborators[0].lastname,
          email: transfer.collaborators[0].email,
        },
      })),
    };
  }
  throw new ApiError("Failed to fetch the audit");
};
/**
 * Creates a new audit.
 * @param args - The form data to create the audit.
 * @returns The created audit.
 * @throws {ApiError} if the request fails.
 */
export const createAudit = async (args) => {
  const response = await fetchService.post(
    "/audit_notations",
    JSON.stringify({
      module: args.module,
      module_id: args.moduleId,
      notes: args.scores.map((score) => ({
        audit_performance_indicator_id: score.criteriaId,
        note: score.score,
      })),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) {
    throw new ApiError("Failed to create the audit");
  }
  const { data: item } = await response.json();
  return {
    id: item.id,
    reference: item.audit_reference,
    title: item.title,
    module: item.module,
    moduleId: item.module_id,
    originalGlobalScore: item.original_note,
    originalStatus: item.original_status,
    currentGlobalScore: item.last_note,
    currentStatus: item.last_status,
    createdBy: item.creator,
    originalScores: item.original_indicators.map((score) => ({
      score: score.note,
      criteria: {
        id: score.audit_performance_indicator.id,
        title: score.audit_performance_indicator.title,
        type: score.audit_performance_indicator.type,
        maxScore: score.audit_performance_indicator.note,
      },
    })),
    currentScores: item.last_indicators.map((score) => ({
      score: score.note,
      criteria: {
        id: score.audit_performance_indicator.id,
        title: score.audit_performance_indicator.title,
        type: score.audit_performance_indicator.type,
        maxScore: score.audit_performance_indicator.note,
      },
    })),
  };
};
/**
 * Updates a new audit.
 * @param auditId - The id of the audit.
 * @param args - The form data to update the audit.
 * @returns The updated audit.
 * @throws {ApiError} if the request fails.
 */
export const updateAudit = async (auditId, args) => {
  const response = await fetchService.put(
    `/audit_notations/${auditId}`,
    JSON.stringify({
      notes: args.scores.map((score) => ({
        audit_performance_indicator_id: score.criteriaId,
        note: score.score,
      })),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) {
    throw new ApiError("Failed to update the audit");
  }
  const { data: item } = await response.json();
  return {
    id: item.id,
    reference: item.audit_reference,
    title: item.title,
    module: item.module,
    moduleId: item.module_id,
    originalGlobalScore: item.original_note,
    originalStatus: item.original_status,
    currentGlobalScore: item.last_note,
    currentStatus: item.last_status,
    createdBy: item.creator,
    originalScores: item.original_indicators.map((score) => ({
      score: score.note,
      criteria: {
        id: score.audit_performance_indicator.id,
        title: score.audit_performance_indicator.title,
        type: score.audit_performance_indicator.type,
        maxScore: score.audit_performance_indicator.note,
      },
    })),
    currentScores: item.last_indicators.map((score) => ({
      score: score.note,
      criteria: {
        id: score.audit_performance_indicator.id,
        title: score.audit_performance_indicator.title,
        type: score.audit_performance_indicator.type,
        maxScore: score.audit_performance_indicator.note,
      },
    })),
  };
};
/**
 * Forwards an audit.
 * @param auditId - The id of the audit.
 * @param args - The form data to forward the audit.
 * @returns The forwarded audit.
 * @throws {ApiError} if the request fails.
 */
export const forwardAudit = async (auditId, args) => {
  const response = await fetchService.post(
    "/audit_create_transfers",
    JSON.stringify({
      audit_notation_id: auditId,
      forward_title: args.title,
      deadline_transfer: formatDate(args.dueDate),
      description: args.description,
      collaborators: [args.receiverId],
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) {
    throw new ApiError("Failed to forward the audit");
  }
};
/**
 * Completes an audit transfer.
 * @param auditId - The id of the audit.
 * @param args - The form data to complete the audit.
 * @returns The completed audit.
 * @throws {ApiError} if the request fails.
 */
export const completeAudit = async (auditId, args) => {
  const response = await fetchService.post(
    "/complete_transfers",
    JSON.stringify({
      type: "audit",
      transfer_id: args.transferId,
      notes: args.scores.map((score) => ({
        audit_performance_indicator_id: score.criteriaId,
        note: score.score,
      })),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) {
    throw new ApiError("Failed to complete the audit");
  }
};
/**
 * Prints an audit.
 * @param auditId - The id of the audit.
 * @throws {ApiError} if the request fails.
 */
export const printAudit = async (auditId) => {
  const response = await fetchService.get(
    `/generate_pdf_fiche_suivi_audit?audit_notation_id=${auditId}`
  );
  if (!response.ok) {
    throw new ApiError("Failed to print the audit");
  }
  const buffer = Array.from(new Uint8Array(await response.arrayBuffer()));
  const filename =
    response.headers
      .get("Content-Disposition")
      ?.match(/filename="(.+)"/)?.[1] ?? "audit.pdf";
  return {
    buffer,
    filename,
  };
};

export const planAudit = async (args) => {
  try {
    const response = await fetchService.post(
      "/audit_periods",
      JSON.stringify({
        title: args.title,
        deadline: args.deadline,
      }),
      { headers: { "Content-Type": "application/json" } }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to complete the audit",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export const getPlannedAudit = async () => {
  try {
    const response = await fetchService.get("/audit_periods");

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to get planned audit",
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export const deletePlannedAudit = async (id: string) => {
  try {
    const response = await fetchService.delete(`/audit_periods/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to complete the audit",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export const updatePlannedAudit = async (id, title, deadline) => {
  try {
    console.log("hi");

    const response = await fetchService.put(
      `/audit_periods/${id}?${title}&${deadline}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to complete the audit",
      };
    }

    const data = await response.json();
    console.log(data);

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};
