"use server";

import { apiClient, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";

export async function updateMandate(mandateId: string, startDate: string) {
  const { error } = await apiClient.PUT("/mandates/{mandateId}", {
    params: { path: { mandateId } },
    body: { appointment_date: toBackendDate(startDate) },
  });
  throwIfError(error, "Failed to update the mandate");
}

export async function renewMandate(directorId: string, startDate: string) {
  const { error } = await apiClient.POST("/renew_mandate_administrator", {
    body: { director_id: directorId, appointment_date: toBackendDate(startDate) },
  });
  throwIfError(error, "Failed to renew the mandate");
}
