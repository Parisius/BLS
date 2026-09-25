"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import type { components } from "@/lib/api/schema";

type DirectorResponse = components["schemas"]["Director"];

export interface Mandate {
  id: string;
  startDate?: string;
  endDate?: string;
  renewalDate?: string;
  status?: string;
}

export interface Director {
  id: string;
  name: string;
  nationality?: string;
  address?: string;
  birthDate?: string;
  birthPlace?: string;
  mandates: Mandate[];
}

function mapDirector(item: DirectorResponse): Director {
  return {
    id: item.id!,
    name: item.name ?? "",
    nationality: item.nationality,
    address: item.address,
    birthDate: item.birthdate,
    birthPlace: item.birthplace,
    mandates: (item.mandates ?? []).map((m) => ({
      id: m.id!,
      startDate: m.appointment_date,
      endDate: m.expiry_date,
      renewalDate: m.renewal_date,
      status: m.status,
    })),
  };
}

export async function getAllDirectors() {
  const data = unwrap(await apiClient.GET("/directors"));
  return data.map(mapDirector);
}

export interface DirectorFormArgs {
  name: string;
  nationality: string;
  address: string;
  birthDate: string;
  birthPlace: string;
}

export async function createDirector(args: DirectorFormArgs & { mandateStartDate: string }) {
  const data = unwrap(
    await apiClient.POST("/directors", {
      body: {
        name: args.name,
        nationality: args.nationality,
        address: args.address,
        birthdate: toBackendDate(args.birthDate),
        birthplace: args.birthPlace,
        appointment_date: toBackendDate(args.mandateStartDate),
      },
    }),
  );
  return mapDirector(data);
}

export async function updateDirector(directorId: string, args: DirectorFormArgs) {
  const data = unwrap(
    await apiClient.PUT("/directors/{directorId}", {
      params: { path: { directorId } },
      body: {
        name: args.name,
        nationality: args.nationality,
        address: args.address,
        birthdate: toBackendDate(args.birthDate),
        birthplace: args.birthPlace,
      },
    }),
  );
  return mapDirector(data);
}

export async function deleteDirector(directorId: string) {
  const { error } = await apiClient.DELETE("/directors/{directorId}", {
    params: { path: { directorId } },
  });
  throwIfError(error, "Failed to delete the director");
}
